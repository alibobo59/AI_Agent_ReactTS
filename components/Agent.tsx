'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.actions';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CONNECTING = 'CONNECTING',
  FINISHED = 'FINISHED',
}
const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log('error', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);
  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log('Generate feedback here');
    //ToDO: Create a server action that generates feedback

    const { success, feedbackId } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    });
    if (success && feedbackId) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log('Failed to generate feedback');
      router.push('/');
    }
  };
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        router.push('/');
      } else if (!interviewId) {
        console.error('interviewId is undefined');
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId, interviewId, router]);
  const latestMessage = messages[messages.length - 1]?.content;
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (type === 'generate') {
      const assistantOverrides = {
        variableValues: {
          username: userName,
          userId: userId,
        },
        clientMessages: [], // Add if required by AssistantOverrides
        serverMessages: [],
      };
      await vapi.start(
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        assistantOverrides,
      );
    } else {
      let formatedQuestions = '';
      if (questions) {
        formatedQuestions = questions
          .map((question) => {
            return `-${question}`;
          })
          .join('\n');
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formatedQuestions,
          clientMessages: [], // Add if required by AssistantOverrides
          serverMessages: [],
        },
      });
    }
  };
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="ai-avt"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3>Ai Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user-avt"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              className={cn(
                'transitionn-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100',
              )}
              key={latestMessage}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? (
          <button
            onClick={handleCall}
            className="relative btn-call"
          >
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden',
              )}
            />
            <span>{isCallInactiveOrFinished ? 'CALL' : '. . .'}</span>
          </button>
        ) : (
          <button
            className="btn-disconnect"
            onClick={handleDisconnect}
          >
            END
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;

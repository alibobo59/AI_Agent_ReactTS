import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
enum CallStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CONNECTING = 'CONNECTING',
  FINISHED = 'FINISHED',
}
const Agent = ({ userName }: AgentProps) => {
  const isSpeaking = true;
  const callStatus = CallStatus.INACTIVE;
  const msg = ['whats your name', 'whats your experience'];
  const lastMsg = msg[msg.length - 1];
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
      {msg.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              className={cn(
                'transitionn-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100',
              )}
              key={lastMsg}
            >
              {lastMsg}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? (
          <button className="relative btn-call">
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                (callStatus !== 'CONNECTING') & 'hidden',
              )}
            />
            <span>
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED'
                ? 'CALL'
                : '...'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">END</button>
        )}
      </div>
    </>
  );
};

export default Agent;

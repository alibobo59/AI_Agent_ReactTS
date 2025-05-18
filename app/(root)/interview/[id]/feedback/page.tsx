import { getCurrentUser } from '@/lib/actions/auth.action';
import {
  getFeedbackByInterviewIdAndUserId,
  getInterviewById,
} from '@/lib/actions/general.actions';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!user) redirect('/sign-in');
  if (!interview) redirect('/');

  const feedback = await getFeedbackByInterviewIdAndUserId({
    interviewId: id,
    userId: user.id!,
  });
  console.log(feedback, 'here is feedback');
  return <div>page</div>;
};

export default Page;

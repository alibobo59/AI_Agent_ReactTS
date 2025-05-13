import React from 'react';
import Agent from '@/components/Agent';
const page = () => {
  return (
    <>
      <h3>Interview generation</h3>
      <Agent
        userName="You"
        userID="user1"
        type="generate"
      />
    </>
  );
};

export default page;

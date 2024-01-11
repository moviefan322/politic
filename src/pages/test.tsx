import runChatGPT from "@/utils/runChatGpt";

const test = () => {
  const response: Promise<string> = runChatGPT("This is a test");

  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  console.log(response);
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
};

export default test;

const { detectForQuestion } = require('../index');

test('detectForQuestion should return a result with model or error', async () => {
  const result = await detectForQuestion("Tell me about yourself");

  expect(result).toHaveProperty("question");
  expect(result).toHaveProperty("timeTaken");

  if (result.error) {
    expect(result.error).toBe("All models failed");
  } else {
    expect(["ModelA", "ModelB", "ModelC"]).toContain(result.model);
    expect(["Human", "AI"]).toContain(result.result);
  }
});
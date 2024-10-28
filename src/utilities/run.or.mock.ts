/**
 * Type definition for a function that returns a Promise of type T
 */
type RunOrMockFunction<T> = () => Promise<T>

/**
 * Conditionally executes a function or returns a mock value based on environment configuration.
 * Useful for testing and development scenarios where you want to bypass actual function execution.
 *
 * @template T - The type of value being returned
 * @param {RunOrMockFunction<T>} fn - The async function to potentially execute
 * @param {T} mockValue - The mock value to return when mocking is enabled
 * @returns {Promise<T>} Either the result of fn() or the mockValue
 *
 * @example
 * const result = await runOrMock(
 *   async () => await expensiveOperation(),
 *   mockData
 * )
 */
export const runOrMock = async <T>(
  fn: RunOrMockFunction<T>,
  mockValue: T
): Promise<T> => {
  // Check if mocking is enabled via environment variable
  const isMocking = process.env.IS_MOCKING === 'true'

  // Return mock value if mocking is enabled
  if (isMocking) {
    return mockValue
  }

  // Otherwise execute and return the actual function
  return fn()
}

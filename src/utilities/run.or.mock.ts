type RunOrMockFunction<T> = () => Promise<T>

export const runOrMock = async <T>(
  fn: RunOrMockFunction<T>,
  mockValue: T
): Promise<T> => {
  const isMocking = process.env.IS_MOCKING === 'true'

  if (isMocking) {
    return mockValue
  }

  return fn()
}

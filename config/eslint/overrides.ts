import { FILE_PATHS } from './constants'

const Overrides: Record<keyof typeof FILE_PATHS, { [key: string]: unknown }> = {
  TESTS: {
    'import/no-relative-parent-imports': 0,
  },
  TESTS_TYPESCRIPT: {},
}

export default Overrides

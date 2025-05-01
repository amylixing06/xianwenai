import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      'html, body': {
        backgroundColor: props.colorMode === 'light' ? 'gray.50' : 'gray.800',
        color: props.colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900',
      },
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }
    })
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.md',
        px: { base: 4, md: 8 },
        py: { base: 4, md: 6 },
      }
    },
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        _focus: {
          boxShadow: 'none',
        }
      }
    }
  }
}) 
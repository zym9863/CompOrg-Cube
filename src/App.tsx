import { MantineProvider, Container, Paper, Tabs, Title, Text, createTheme, rem, Group, Image } from '@mantine/core';
import { NumberConverter } from './components/NumberConverter';
import { FloatVisualizer } from './components/FloatVisualizer';
import { OperationSimulator } from './components/OperationSimulator';
import '@mantine/core/styles.css';

// 创建自定义主题
const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e6f7ff', // 0
      '#bae7ff', // 1
      '#91d5ff', // 2
      '#69c0ff', // 3
      '#40a9ff', // 4
      '#1890ff', // 5
      '#096dd9', // 6
      '#0050b3', // 7
      '#003a8c', // 8
      '#002766', // 9
    ],
  },
  fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
  headings: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '600',
  },
  components: {
    Paper: {
      defaultProps: {
        p: 'lg',
        shadow: 'sm',
        radius: 'md',
      },
    },
    Tabs: {
      styles: {
        tab: {
          fontWeight: 500,
          fontSize: rem(16),
          padding: `${rem(12)} ${rem(18)}`,
          '&[data-active]': {
            borderColor: 'var(--mantine-color-blue-5)',
          },
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-5)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Container size="lg" py="xl">
        {/* 应用标题和头部 */}
        <Group mb="lg" align="center" justify="center">
          <Title order={1} c="blue.7" style={{ fontWeight: 700 }}>计算机组成原理可视化工具</Title>
        </Group>
        <Text c="dimmed" ta="center" mb="xl">
          通过直观的可视化界面，帮助理解计算机数值表示和运算原理
        </Text>

        <Paper>
          <Tabs defaultValue="converter" variant="outline">
            <Tabs.List grow style={{ justifyContent: 'center' }}>
              <Tabs.Tab value="converter" fw={500}>数值转换</Tabs.Tab>
              <Tabs.Tab value="float" fw={500}>浮点数分析</Tabs.Tab>
              <Tabs.Tab value="operation" fw={500}>运算模拟</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="converter" pt="xl">
              <NumberConverter />
            </Tabs.Panel>

            <Tabs.Panel value="float" pt="xl">
              <FloatVisualizer />
            </Tabs.Panel>

            <Tabs.Panel value="operation" pt="xl">
              <OperationSimulator />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </MantineProvider>
  )
}

export default App

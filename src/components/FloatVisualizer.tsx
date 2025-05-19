import { useState } from 'react';
import type { ReactNode } from 'react';
import { TextInput, Paper, Text, Stack, Group, Box, Title, Divider } from '@mantine/core';

// 格式化IEEE 754位
const formatIEEEBits = (bits: string, type: 'sign' | 'exponent' | 'fraction'): ReactNode => {
  const colors = {
    sign: '#ffcdd2',      // 红色系
    exponent: '#c8e6c9',  // 绿色系
    fraction: '#bbdefb',  // 蓝色系
  };

  return (
    <Box
      style={{
        backgroundColor: colors[type],
        borderRadius: '4px',
        padding: '6px 8px',
        fontFamily: 'monospace',
        fontWeight: 500,
        fontSize: '16px',
        textAlign: 'center',
      }}
    >
      {bits}
    </Box>
  );
};

export function FloatVisualizer() {
  const [value, setValue] = useState('');

  const analyzeFloat = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;

    // 获取32位浮点表示
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, num);
    const bits = view.getUint32(0);

    // 解析IEEE 754各部分
    const sign = (bits >>> 31) & 0x1;
    const exponent = (bits >>> 23) & 0xFF;
    const fraction = bits & 0x7FFFFF;

    // 转换为二进制字符串
    const signBit = sign.toString(2);
    const exponentBits = exponent.toString(2).padStart(8, '0');
    const fractionBits = fraction.toString(2).padStart(23, '0');

    return {
      original: num,
      sign,
      exponent,
      fraction,
      signBit,
      exponentBits,
      fractionBits,
      biasedExponent: exponent - 127,
    };
  };

  const result = analyzeFloat(value);

  return (
    <Paper withBorder>
      <Title order={3} ta="center" mb="md">IEEE 754 浮点数分析</Title>
      <Divider mb="md" />

      <Stack gap="md">
        <TextInput
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="输入一个浮点数"
          label="浮点数"
          size="md"
        />

        {result && (
          <Box mt="md">
            <Stack gap="lg">
              <Box>
                <Text size="md" fw={700} c="blue.7" mb="xs">原始值</Text>
                <Box p="xs" bg="gray.0" style={{ borderRadius: '4px' }}>
                  <Text fw={500} style={{ fontFamily: 'monospace', fontSize: '16px' }}>{result.original}</Text>
                </Box>
              </Box>

              <Box>
                <Text size="md" fw={700} c="blue.7" mb="xs">IEEE 754 表示</Text>
                <Stack gap="xs">
                  <Group grow align="flex-start">
                    <Stack gap="xs">
                      <Text size="sm" fw={600} c="red.7">符号位 (1位)</Text>
                      {formatIEEEBits(result.signBit, 'sign')}
                      <Text size="xs" c="dimmed" ta="center">
                        {result.sign === 0 ? '正数 (+)' : '负数 (-)'}
                      </Text>
                    </Stack>

                    <Stack gap="xs">
                      <Text size="sm" fw={600} c="green.7">阶码 (8位)</Text>
                      {formatIEEEBits(result.exponentBits, 'exponent')}
                      <Text size="xs" c="dimmed" ta="center">
                        偏移值: {result.biasedExponent} (实际值: {result.exponent} - 127)
                      </Text>
                    </Stack>

                    <Stack gap="xs">
                      <Text size="sm" fw={600} c="blue.7">尾数 (23位)</Text>
                      {formatIEEEBits(result.fractionBits, 'fraction')}
                      <Text size="xs" c="dimmed" ta="center">
                        隐含前导1
                      </Text>
                    </Stack>
                  </Group>

                  <Box mt="md">
                    <Text size="sm" fw={600} mb="xs">完整32位表示</Text>
                    <Box p="md" style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      overflowX: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      <Box component="span" style={{
                        backgroundColor: '#ffcdd2',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {result.signBit}
                      </Box>
                      <Box component="span" style={{
                        backgroundColor: '#c8e6c9',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {result.exponentBits}
                      </Box>
                      <Box component="span" style={{
                        backgroundColor: '#bbdefb',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {result.fractionBits}
                      </Box>
                    </Box>
                  </Box>

                  <Box mt="md">
                    <Text size="sm" fw={600} mb="xs">计算公式</Text>
                    <Box p="md" bg="gray.0" style={{
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '16px'
                    }}>
                      <Text>
                        {result.original} = (-1)<sup>{result.sign}</sup> × 2<sup>{result.biasedExponent}</sup> × (1 + 尾数值)
                      </Text>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

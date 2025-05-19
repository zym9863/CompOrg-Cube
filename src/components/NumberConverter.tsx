import { useState } from 'react';
import type { ReactNode } from 'react';
import { TextInput, Paper, Text, Stack, Box, Title, Divider } from '@mantine/core';

// 格式化二进制数，每4位一组
const formatBinary = (binary: string): ReactNode => {
  const groups = [];
  for (let i = 0; i < binary.length; i += 4) {
    const group = binary.slice(i, i + 4);
    groups.push(
      <Box
        key={i}
        component="span"
        className="bit-block"
        style={{
          display: 'inline-block',
          margin: '0 2px',
          padding: '2px 4px',
          backgroundColor: i === 0 ? '#e6f7ff' : '#f5f5f5',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        {group}
      </Box>
    );
  }
  return <>{groups}</>;
};

export function NumberConverter() {
  const [value, setValue] = useState('');

  // 转换为不同进制
  const toBinary = (num: number) => num.toString(2).padStart(32, '0');
  const toOctal = (num: number) => num.toString(8);
  const toHex = (num: number) => num.toString(16).toUpperCase();

  // 生成补码表示
  const getTwosComplement = (num: number) => {
    if (num >= 0) return toBinary(num);
    const absNum = Math.abs(num);
    const binary = toBinary(absNum);
    // 取反
    const inverted = binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
    // 加1
    const complement = (parseInt(inverted, 2) + 1).toString(2).padStart(32, '0');
    return complement;
  };

  const parseNumber = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return null;
    return {
      decimal: num,
      binary: toBinary(num),
      octal: toOctal(num),
      hex: toHex(num),
      twosComplement: getTwosComplement(num)
    };
  };

  const result = parseNumber(value);

  return (
    <Paper withBorder>
      <Title order={3} ta="center" mb="md">数值转换器</Title>
      <Divider mb="md" />

      <Stack gap="md">
        <TextInput
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="输入一个十进制数"
          label="数值"
          size="md"
        />

        {result && (
          <Box mt="md">
            <Stack gap="lg">
              <Box>
                <Text size="sm" fw={700} c="blue.7" mb={5}>十进制</Text>
                <Box p="xs" bg="gray.0" style={{ borderRadius: '4px' }}>
                  <Text fw={500} style={{ fontFamily: 'monospace' }}>{result.decimal}</Text>
                </Box>
              </Box>

              <Box>
                <Text size="sm" fw={700} c="blue.7" mb={5}>二进制 (32位)</Text>
                <Box p="xs" bg="gray.0" style={{ borderRadius: '4px', overflowX: 'auto' }}>
                  {formatBinary(result.binary)}
                </Box>
              </Box>

              <Box>
                <Text size="sm" fw={700} c="blue.7" mb={5}>八进制</Text>
                <Box p="xs" bg="gray.0" style={{ borderRadius: '4px' }}>
                  <Text fw={500} style={{ fontFamily: 'monospace' }}>{result.octal}</Text>
                </Box>
              </Box>

              <Box>
                <Text size="sm" fw={700} c="blue.7" mb={5}>十六进制</Text>
                <Box p="xs" bg="gray.0" style={{ borderRadius: '4px' }}>
                  <Text fw={500} style={{ fontFamily: 'monospace' }}>0x{result.hex}</Text>
                </Box>
              </Box>

              <Box>
                <Text size="sm" fw={700} c="blue.7" mb={5}>补码表示 (32位)</Text>
                <Box p="xs" bg="gray.0" style={{ borderRadius: '4px', overflowX: 'auto' }}>
                  {formatBinary(result.twosComplement)}
                </Box>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

import { useState } from 'react';
import type { ReactNode } from 'react';
import { TextInput, Paper, Text, Stack, Group, Select, Box, Title, Divider, Badge } from '@mantine/core';

type Operation = 'add' | 'subtract' | 'and' | 'or' | 'xor' | 'not' | 'shift_left' | 'shift_right';

// 格式化二进制数，每4位一组
const formatBinary = (binary: string): ReactNode => {
  const groups = [];
  for (let i = 0; i < binary.length; i += 4) {
    const group = binary.slice(i, i + 4);
    groups.push(
      <Box
        key={i}
        component="span"
        style={{
          display: 'inline-block',
          margin: '0 2px',
          padding: '2px 4px',
          backgroundColor: '#f5f5f5',
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

// 格式化操作步骤
const formatOperationStep = (step: string): ReactNode => {
  const lines = step.split('\n');
  return (
    <Stack gap={4}>
      {lines.map((line, idx) => {
        if (line.includes('='.repeat(10))) {
          return <Divider key={idx} />;
        }

        if (line.includes('(carry)')) {
          const parts = line.split('(carry)');
          return (
            <Text key={idx} style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
              {parts[0]}
              <Badge color="blue" size="sm" variant="light">carry</Badge>
            </Text>
          );
        }

        return (
          <Text key={idx} style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
            {line}
          </Text>
        );
      })}
    </Stack>
  );
};

export function OperationSimulator() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState<Operation>('add');

  const toBinary = (num: number) => num.toString(2).padStart(32, '0');
  const toSignedBinary = (num: number) => {
    if (num >= 0) return toBinary(num);
    const absNum = Math.abs(num);
    const binary = toBinary(absNum);
    const inverted = binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
    return (parseInt(inverted, 2) + 1).toString(2).padStart(32, '0');
  };

  const simulateOperation = () => {
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);
    if (isNaN(n1) || (operation !== 'not' && isNaN(n2))) return null;

    const b1 = toSignedBinary(n1);
    const b2 = operation !== 'not' ? toSignedBinary(n2) : '';

    let result: number;
    let steps: string[] = [];

    switch (operation) {
      case 'add':
        result = n1 + n2;
        steps = simulateAddition(b1, b2);
        break;
      case 'subtract':
        result = n1 - n2;
        steps = simulateSubtraction(b1, b2);
        break;
      case 'and':
        result = n1 & n2;
        steps = [`${b1}\nAND\n${b2}\n${'='.repeat(32)}\n${toBinary(result)}`];
        break;
      case 'or':
        result = n1 | n2;
        steps = [`${b1}\nOR\n${b2}\n${'='.repeat(32)}\n${toBinary(result)}`];
        break;
      case 'xor':
        result = n1 ^ n2;
        steps = [`${b1}\nXOR\n${b2}\n${'='.repeat(32)}\n${toBinary(result)}`];
        break;
      case 'not':
        result = ~n1;
        steps = [`${b1}\nNOT\n${'='.repeat(32)}\n${toBinary(result)}`];
        break;
      case 'shift_left':
        result = n1 << n2;
        steps = simulateShift(b1, n2, 'left');
        break;
      case 'shift_right':
        result = n1 >> n2;
        steps = simulateShift(b1, n2, 'right');
        break;
    }

    return { result, steps };
  };

  const simulateAddition = (b1: string, b2: string) => {
    const steps: string[] = [];
    let carry = '0';
    let result = '';
    let stepResult = '';
    steps.push(`${b1}\n+\n${b2}`);

    for (let i = 31; i >= 0; i--) {
      const bit1 = b1[i];
      const bit2 = b2[i];
      const sum = parseInt(bit1) + parseInt(bit2) + parseInt(carry);
      carry = sum >= 2 ? '1' : '0';
      result = (sum % 2).toString() + result;
      stepResult = ' '.repeat(i) + carry + ' (carry)\n' +
                  b1 + '\n' +
                  '+\n' +
                  b2 + '\n' +
                  '='.repeat(32) + '\n' +
                  result.padStart(32, '.');
      steps.push(stepResult);
    }
    return steps;
  };

  const simulateSubtraction = (b1: string, b2: string) => {
    // 通过补码加法实现减法
    const negB2 = toSignedBinary(-parseInt(num2));
    return [
      `${b1}\n-\n${b2}\n转换为加法：\n${b1}\n+\n${negB2}`,
      ...simulateAddition(b1, negB2)
    ];
  };

  const simulateShift = (binary: string, shiftAmount: number, direction: 'left' | 'right') => {
    const steps: string[] = [];
    let current = binary;
    steps.push(current);

    for (let i = 0; i < shiftAmount; i++) {
      if (direction === 'left') {
        current = current.slice(1) + '0';
      } else {
        current = (current[0] === '1' ? '1' : '0') + current.slice(0, -1);
      }
      steps.push(`Step ${i + 1}:\n${current}`);
    }
    return steps;
  };

  const result = simulateOperation();

  return (
    <Paper withBorder>
      <Title order={3} ta="center" mb="md">运算模拟器</Title>
      <Divider mb="md" />

      <Stack gap="md">
        <Group grow>
          <TextInput
            value={num1}
            onChange={(e) => setNum1(e.currentTarget.value)}
            placeholder="输入第一个数"
            label="操作数1"
            size="md"
          />
          {operation !== 'not' && (
            <TextInput
              value={num2}
              onChange={(e) => setNum2(e.currentTarget.value)}
              placeholder="输入第二个数"
              label="操作数2"
              size="md"
            />
          )}
        </Group>

        <Select
          value={operation}
          onChange={(value: string | null) => {
            if (value) setOperation(value as Operation);
          }}
          data={[
            { value: 'add', label: '加法' },
            { value: 'subtract', label: '减法' },
            { value: 'and', label: '与运算' },
            { value: 'or', label: '或运算' },
            { value: 'xor', label: '异或运算' },
            { value: 'not', label: '取反运算' },
            { value: 'shift_left', label: '左移' },
            { value: 'shift_right', label: '右移' },
          ]}
          label="运算类型"
          size="md"
        />

        {result && (
          <Box mt="md">
            <Divider label="运算过程" labelPosition="center" mb="md" />

            <Stack gap="lg">
              {result.steps.map((step, index) => (
                <Box
                  key={index}
                  p="md"
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <Badge
                    color="blue"
                    size="lg"
                    variant="light"
                    mb="sm"
                  >
                    步骤 {index + 1}
                  </Badge>
                  {formatOperationStep(step)}
                </Box>
              ))}

              <Box
                p="md"
                style={{
                  backgroundColor: '#e6f7ff',
                  borderRadius: '8px',
                  border: '1px solid #91d5ff',
                }}
              >
                <Text size="lg" fw={700} mb="md" c="blue.7">
                  计算结果
                </Text>
                <Group>
                  <Box>
                    <Text size="sm" fw={600} c="dimmed">十进制值</Text>
                    <Text fw={700} style={{ fontSize: '18px' }}>{result.result}</Text>
                  </Box>
                  <Divider orientation="vertical" />
                  <Box>
                    <Text size="sm" fw={600} c="dimmed">二进制表示</Text>
                    <Box style={{ overflowX: 'auto' }}>
                      {formatBinary(toSignedBinary(result.result))}
                    </Box>
                  </Box>
                </Group>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

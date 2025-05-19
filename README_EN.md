# Computer Organization Visualization Tool (CompOrg Cube)

English | [简体中文](./README.md)

This is an interactive visualization tool designed to assist in learning computer organization principles, helping users understand computer number representation and operation principles through an intuitive interface.

## Project Introduction

This project aims to visualize core concepts in computer organization, helping learners better understand how computers represent and process data. The project includes three main functional modules, each targeting different learning content.

## Features

### 1. Number Converter

Convert decimal numbers into various computer representations:
- Binary (32-bit) representation, displayed in groups of 4 bits
- Octal representation
- Hexadecimal representation
- Two's complement representation (32-bit)

### 2. Floating-Point Analyzer

Analyze the components of IEEE 754 floating-point standard:
- Sign bit (1 bit): Indicates positive or negative
- Exponent (8 bits): Represents the exponent part
- Mantissa (23 bits): Represents the fractional part
- Visualize the binary representation of floating-point numbers
- Display the floating-point calculation formula

### 3. Operation Simulator

Simulate various computer operations:
- Addition operations (including carry process)
- Subtraction operations (implemented through two's complement addition)
- Bitwise operations (AND, OR, XOR, NOT)
- Shift operations (left shift, right shift)
- Step-by-step demonstration of operation processes

## Technology Stack

- **Frontend Framework**: React + TypeScript
- **Build Tool**: Vite
- **UI Component Library**: Mantine UI
- **Styling**: CSS-in-JS

## Usage

1. Select the desired function module on the main interface (number conversion, floating-point analysis, or operation simulation)
2. Enter the appropriate values according to the interface prompts
3. View the visualization results and detailed explanations

## Development and Building

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build Project
```bash
npm run build
```

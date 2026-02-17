'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    line-height: 1.5;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: 1.2;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
`;

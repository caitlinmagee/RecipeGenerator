import '@testing-library/jest-dom';

global.matchMedia = global.matchMedia || function (){
return {
 addListener: jest.fn(),
 removeListener: jest.fn()
}}

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ meals: [] })
  })
);

import { expect, test } from 'vitest';
import { appKey, appSecret, refresh_token } from './config';
import ApiExecutor from '../src/index';
const apiExecutor = new ApiExecutor({
  appKey,
  appSecret,
});

test('code2RefreshToken', async () => {
  const res = await apiExecutor.code2RefreshToken(
    '6d77c22e-c200-4de1-af60-43fd50831938',
    'http://www.baidu.com/',
  );
  console.log('code2RefreshToken res is', res);
  expect(res.refresh_token.length > 0).toBe(true);
});

test('refreshToken2AccessToken', async () => {
  const res = await apiExecutor.refreshToken2AccessToken(refresh_token);
  console.log('refreshToken2AccessToken res is', res);
  expect(res.access_token.length > 0).toBe(true);
});

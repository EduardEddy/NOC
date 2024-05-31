import { envs } from "./envs.plugin"


describe('envs.plugins.ts', () => {
  test('should return env options', () => {
    console.log('Console envs plugins', process.env.PORT)
    expect(envs).toEqual({
      "MAILER_EMAIL": "eduardeddyacevedo@gmail.com",
      "MAILER_SECRET_KEY": "aydswbdedlasvvxs",
      "MAILER_SERVICE": "gmail",
      "MONGO_DB_NAME": "NOC",
      "MONGO_PASS": "123456",
      "MONGO_URL": "mongodb://eduard:123456@localhost:27017/?authMechanism=DEFAULT",
      "MONGO_USER": "eduard",
      "PORT": 3000,
      "PROD": true,
    })
  });

  test('should return error if not found env', async () => {
    jest.resetModules();
    process.env.PORT = 'ABC';
    try {
      await import('./envs.plugin');
      expect(true).toBe(false);
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  })
})
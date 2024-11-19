import api, { storage } from '@forge/api';
import axios from 'axios';
import { router } from '@forge/bridge';

export async function handler(req,res) {
  try {
    const code = req.queryParameters.code[0];
    // const payload = {
    //   client_id: "fhHuUVzKyiNKaobgKnT3tg7OIOyVaYAnC9PS3CuXGBU",
    //   client_secret: "9p41peKl8oQ2r8CdUZdW2GNjAzvjjZYlwgmUMmg9rRI",
    //   grant_type: "authorization_code",
    //   redirect_uri: "https://848a27cf-010b-4e41-8979-8fb5c994b73c.hello.atlassian-dev.net/x1/dOzPfIUgEVLnbrdnfyuVkTkkxqM",
    //   code: code
    // };
    // const config = {
    //   method: 'post',
    //   url: 'https://api.surveysparrow.com/oauth/token/',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   data: JSON.stringify(payload)
    // };
    // await axios.request(config);
    if (req.method === 'GET') {
      return {
        statusCode: 302,
        headers: {
          Location: `https://api.surveysparrow.com`
        },
        body: JSON.stringify({ success: true })
      };
    }
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
} 
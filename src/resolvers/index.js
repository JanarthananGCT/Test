import Resolver from '@forge/resolver';
import api, { route, storage, webTrigger } from '@forge/api';
import axios from 'axios';

const resolver = new Resolver();

resolver.define('initSurveySparrowAuth', async () => {
  const surveySparrow = api.asUser().withProvider('surveysparrow', 'surveysparrow-api');
  const isAuthenticated = await surveySparrow.hasCredentials();
  console.log(`surveysparrow: ${isAuthenticated}`);
  if (!isAuthenticated) {
    const data = await surveySparrow.requestCredentials();
    console.log(data, "data");
  }
});
// resolver.define('initSurveySparrowAuth', async () => {
//   try {
//     const surveySparrow = api.asUser().withProvider('surveysparrow');
//     const data = await surveySparrow.requestCredentials()
//     console.log(data, "+++++");
//     // if (!await surveySparrow.hasCredentials()) {
//     //   const authUrl = await surveySparrow.requestCredentials();
//     //   return { success: true, authUrl };
//     // }
//     return { success: true, authenticated: true };
//   } catch (error) {
//     console.error('Auth initialization error:', error);
//     throw error;
//   }
// });

resolver.define('checkAuthStatus', async () => {
  try {
    const surveySparrow = api.asUser().withProvider('surveysparrow');
    const hasCredentials = await surveySparrow.hasCredentials();
    const isAuthenticated = await storage.get('surveysparrow_authenticated');
    return { authenticated: hasCredentials && isAuthenticated };
  } catch (error) {
    console.error('Auth status check error:', error);
    return { authenticated: false };
  }
});

resolver.define('getUserProfile', async () => {
  try {
    const surveySparrow = api.asUser().withProvider('surveysparrow');
    const response = await surveySparrow.fetch('/api/v1/users/me');
    return await response.json();
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
});
resolver.define('getAllSurveys', async () => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get('https://api.surveysparrow.com/v3/surveys', {
      headers: {
        'Authorization': token
      }
    });
    return JSON.stringify(response.data);
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
});
resolver.define('getAllSurveyContacts', async () => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get('https://api.surveysparrow.com/v3/contact_properties', {
      headers: {
        'Authorization': token
      }
    });
    return JSON.stringify(response.data);
  } catch (error) {
    console.error('SurveySparrow contacts fetch error:', error);
    throw error;
  }
});

resolver.define('getAllSurveyQuestions', async (req) => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get(`https://api.surveysparrow.com/v3/questions?survey_id=${req.payload.surveyId}`, {
      headers: {
        'Authorization': token
      }
    });
    return JSON.stringify(response.data);
  } catch (error) {
    console.error('SurveySparrow questions fetch error:', error);
    throw error;
  }
});

resolver.define('getAllSurveyExpressions', async (req) => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get(`https://api.surveysparrow.com/v3/expressions?survey_id=${req.payload.surveyId}`, {
      headers: {
        'Authorization': token
      }
    });
    return JSON.stringify(response.data);
  } catch (error) {
    console.error('SurveySparrow expressions fetch error:', error);
    throw error;
  }
});

resolver.define('getAllSurveyVariables', async (req) => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get(`https://api.surveysparrow.com/v3/variables?survey_id=${req.payload.surveyId}`, {
      headers: {
        'Authorization': token
      }
    });
    return JSON.stringify(response.data);
  } catch (error) {
    console.error('SurveySparrow variables fetch error:', error);
    throw error;
  }
});

resolver.define('getAllJiraProjects', async () => {
  try {
    const jira = api.asUser().requestJira(route`/rest/api/3/project/search`, {
      headers: {
        'Accept': 'application/json'
      },
      // Add query parameters to get maximum results
      searchParams: {
        maxResults: 200 // Maximum allowed per request
      }
    });

    const response = await jira;
    return await response.json();
  } catch (error) {
    console.error('Jira projects fetch error:', error);
    throw error;
  }
});
resolver.define('storeMappingObject', async (req) => {
  try {
    const mappingObject = req.payload.mappings;
    await storage.set('mappingObject', mappingObject);
    return { success: true, message: 'Mapping object stored successfully' };
  } catch (error) {
    console.error('Error storing mapping object:', error);
    throw error;
  }
});

resolver.define('getMappingObject', async () => {
  try {
    const mappingObject = await storage.get('mappingObject');
    return mappingObject || null;
  } catch (error) {
    console.error('Error retrieving mapping object:', error);
    throw error;
  }
});
resolver.define(' ', async (req) => {
  return await storage.delete(req.payload.key);
});

resolver.define('setSurveysparrowWebhook', async (req) => {
  try {
    const token = await storage.get('Token');
    const webhookResponses = [];

    // Create base config
    const baseConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.surveysparrow.com/v3/webhooks',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    };

    // Process each payload item
    const payloadItems = JSON.parse(req.payload.data.payload);
    console.log(payloadItems, "payloadItems");
    for (const item of payloadItems) {
      const webhookData = {
        url: req.payload.data.url,
        event_type: req.payload.data.event_type,
        survey_id: req.payload.data.survey_id,
        http_method: req.payload.data.http_method,
        name: req.payload.data.name,
        payload: item
      };

      const config = {
        ...baseConfig,
        data: JSON.stringify(webhookData)
      };

      const response = await axios.request(config);
      webhookResponses.push(response.data);
    }

    return {
      success: true,
      message: 'Webhooks created successfully',
      responses: webhookResponses
    };
  } catch (error) {
    console.error('Webhook creation error:', error);
    throw error;
  }
});
resolver.define('getWebTriggerUrl', async (req) => {
  return await webTrigger.getUrl(req.payload.triggerId);
});

resolver.define('setToken', async (req) => {
  return await storage.set('Token', req.payload.token);
});
resolver.define('getToken', async () => {
  const token = await storage.get('Token');
  return token
});
resolver.define('getAllShareChannels', async (req) => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get(`https://api.surveysparrow.com/v3/channels?survey_id=${req.payload.surveyId}`, {
      headers: {
        'Authorization': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('SurveySparrow variables fetch error:', error);
    throw error;
  }
});

resolver.define('getMappingsById', async (req) => {
  const response = await storage.get('mappingObject');
  const mappings = response.find(mapping => mapping.id === req.payload.id);
  return mappings;
});
resolver.define('deleteMappingsById', async (req) => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get(`https://api.surveysparrow.com/v3/webhooks`, {
      headers: {
        'Authorization': token
      }
    });
    const webhooks = response.data?.data.filter(webhook => webhook.name === `Jira_webhook_${req.payload.id}`);
    const deletedWebhooks = [];
    for (const item of webhooks) {
      const response = await axios.delete(`https://api.surveysparrow.com/v3/webhooks/${item.id}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': token
        }
      })
      deletedWebhooks.push(response.data);
    }
    const currentMappings = await storage.get('mappingObject');
    const mappings = currentMappings.filter(mapping => mapping.id !== req.payload.id);
    return await storage.set('mappingObject', mappings);
  } catch (error) {
    console.error('SurveySparrow variables fetch error:', error);
    throw error;
  }
});
resolver.define('disableMappingsById', async (req) => {
  try {
    const token = await storage.get('Token');
    const response = await axios.get(`https://api.surveysparrow.com/v3/webhooks`, {
      headers: {
        'Authorization': token
      }
    });
    const webhooks = response.data?.data.filter(webhook => webhook.name === `Jira_webhook_${req.payload.id}`);
    const deletedWebhooks = [];
    for (const item of webhooks) {
      const response = await axios.delete(`https://api.surveysparrow.com/v3/webhooks/${item.id}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': token
        }
      })
      deletedWebhooks.push(response.data);
    }
    const mappings = await storage.get('mappingObject');
    const currentMapping = mappings.find(mapping => mapping.id === req.payload.id);
    currentMapping.isEnabled = false;
    const updatedMappings = mappings.map(mapping => mapping.id === req.payload.id ? currentMapping : mapping);
    await storage.set('mappingObject', updatedMappings)
    return deletedWebhooks;
  } catch (error) {
    console.error('SurveySparrow variables fetch error:', error);
    throw error;
  }
});
resolver.define('enableMappingsById', async (req) => {
  try {
    const token = await storage.get('Token');
    const mappings = await storage.get('mappingObject');
    const currentMapping = mappings.find(mapping => mapping.id === req.payload.id);
    const webhookResponses = [];
    const baseConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.surveysparrow.com/v3/webhooks',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    };

    const payloadItems = currentMapping.mappings;
    for (const item of payloadItems) {
      const webhookData = {
        url: currentMapping.webhookURL,
        event_type: "submission_completed",
        survey_id: currentMapping.surveyId,
        http_method: "POST",
        name: `Jira_webhook_${currentMapping.id}`,
        payload: item
      };
      const config = {
        ...baseConfig,
        data: JSON.stringify(webhookData)
      };

      const response = await axios.request(config);
      webhookResponses.push(response.data);
    }
    currentMapping.isEnabled = true;
    const updatedMappings = mappings.map(mapping => mapping.id === req.payload.id ? currentMapping : mapping);
    await storage.set('mappingObject', updatedMappings)
    return { success: true, message: 'Webhooks enabled successfully' };
  } catch (error) {
    console.error('SurveySparrow variables fetch error:', error);
    throw error;
  }
});
resolver.define('updateMappingsById', async (req) => {
  return await storage.set(req.payload.id, req.payload.mappings);
});
resolver.define('logout', async (req) => {
  return await storage.delete('Token');
});
resolver.define('saveTrigger', async (req) => {
  return await storage.set('Trigger', req.payload.trigger);
});
resolver.define('getTrigger', async (req) => {
  return await storage.get('Trigger');
});
resolver.define('deleteTrigger', async (req) => {
  return await storage.delete('Trigger');
});
resolver.define('disableTrigger', async (req) => {
  const triggers = await storage.get('Trigger');
  const currentTrigger = triggers.find(trigger => trigger.id === req.payload.id);
  currentTrigger.isEnabled = false;
  const updatedTriggers = triggers.map(trigger => trigger.id === req.payload.id ? currentTrigger : trigger);
  return await storage.set('Trigger', updatedTriggers);
});
resolver.define('enableTrigger', async (req) => {
  const triggers = await storage.get('Trigger');
  const currentTrigger = triggers.find(trigger => trigger.id === req.payload.id);
  currentTrigger.isEnabled = true;
  const updatedTriggers = triggers.map(trigger => trigger.id === req.payload.id ? currentTrigger : trigger);
  return await storage.set('Trigger', updatedTriggers);
});
resolver.define('deleteTriggerById', async (req) => {
  const triggers = await storage.get('Trigger');
  const updatedTriggers = triggers.filter(trigger => trigger.id !== req.payload.id);
  return await storage.set('Trigger', updatedTriggers);
});
resolver.define('getTriggersById', async (req) => {
  const triggers = await storage.get('Trigger');
  const trigger = triggers.find(trigger => trigger.id === req.payload.id);
  return trigger;
});

export const handler = resolver.getDefinitions();

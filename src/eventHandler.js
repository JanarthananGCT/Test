// src/eventHandler.js
import api, { route, storage } from '@forge/api';
import axios from 'axios';
const handleEvent = async (req, type) => {
  try {
    const triggers = await storage.get('Trigger');
    let isConfigured = null;
    for (const trigger of triggers) {
      const matchedEvent = trigger.events.find((event) => event.value === type);
      if (matchedEvent) {
        isConfigured = trigger;
        break;
      }
    }
    if (isConfigured) {
      const token = await storage.get('Token');
      const baseConfig = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://api.surveysparrow.com/v3/channels/${isConfigured.shareChannel.value}`,
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };
      const shareData = {
        survey_id: isConfigured.survey.value,
      }
      const config = {
        ...baseConfig,
        data: JSON.stringify(shareData)
      };
      const response = await axios.request(config);
      console.log(response, "response");
      return {
        success: true,
        message: 'Survey Shared Successfully',
      };
    }
    else {
      return {
        success: false,
        message: 'No Triggers Found'
      };
    }
  } catch (error) {
    console.error('Trigger Event Error', error);
    throw error;
  }
}
export async function handler(event, context) {
  const { eventType, issue } = event;
  switch (eventType) {
    case 'avi:jira:created:issue':
      console.log('Issue created:');
      return await handleEvent(event, "issue_created");
    case 'avi:jira:updated:issue':
      console.log('Issue updated:', issue);
      return await handleEvent(event, "issue_updated");
    case 'avi:jira:deleted:issue':
      console.log('Issue deleted:', issue);
      return await handleEvent(event, "issue_deleted");
    case 'avi:jira:created:task':
      console.log('Task created:', task);
      return await handleEvent(event, "task_created"  );
    case 'avi:jira:updated:task':
      console.log('Task updated:', task);
      return await handleEvent(event, "task_updated");
    case 'avi:jira:created:story':
      console.log('Story created:', story);
      return await handleEvent(event, "story_created" );
    case 'avi:jira:updated:story':
      console.log('Story updated:', story);
      return await handleEvent(event, "story_updated");
    case 'avi:jira:deleted:story':
      console.log('Story deleted:', story);
      return await handleEvent(event, "story_deleted");
    case 'avi:jira:created:epic':
      console.log('Epic created:', epic);
      return await handleEvent(event, "epic_created");
    case 'avi:jira:updated:epic':
      console.log('Epic updated:', epic);
      return await handleEvent(event, "epic_updated");
    case 'avi:jira:deleted:epic':
      console.log('Epic deleted:', epic);
      return await handleEvent(event, "epic_deleted");
    default:
      console.log(`Unhandled event type: ${type}`);
  }
}

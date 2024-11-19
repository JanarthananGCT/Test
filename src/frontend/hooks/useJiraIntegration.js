import { useState, useCallback } from 'react';
import { invoke } from '@forge/bridge';

export const useJiraIntegration = () => {
  const [jiraProjects, setJiraProjects] = useState([]);
  const [configuredTriggers, setConfiguredTriggers] = useState([]);
  const [mappings, setMappings] = useState([]);

  const fetchJiraProjects = useCallback(async () => {
    try {
      const response = await invoke('getAllJiraProjects');
      setJiraProjects(
        response.values.map(project => ({
          value: project.key,
          label: project.name
        }))
      );
    } catch (error) {
      console.error('Failed to fetch Jira projects', error);
    }
  }, []);

  const fetchMappings = useCallback(async () => {
    try {
      const response = await invoke('getMappingObject');
      setMappings(response);
    } catch (error) {
      console.error('Failed to fetch mappings', error);
    }
  }, []);

  const fetchTriggers = useCallback(async () => {
    try {
      const response = await invoke('getTrigger');
      setConfiguredTriggers(response.length ? response : []);
    } catch (error) {
      console.error('Failed to fetch triggers', error);
    }
  }, []);

  const createMapping = useCallback(async (mappingData) => {
    // Implement mapping creation logic
  }, []);

  const createTrigger = useCallback(async (triggerData) => {
    // Implement trigger creation logic
  }, []);

  return {
    jiraProjects,
    configuredTriggers,
    mappings,
    fetchJiraProjects,
    fetchMappings,
    fetchTriggers,
    createMapping,
    createTrigger
  };
};

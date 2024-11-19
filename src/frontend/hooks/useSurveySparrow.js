import { useState, useCallback } from 'react';
import { invoke } from '@forge/bridge';

export const useSurveySparrow = () => {
  const [surveys, setSurveys] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [shareChannels, setShareChannels] = useState([]);

  const fetchSurveys = useCallback(async () => {
    try {
      const response = await invoke('getAllSurveys');
      setSurveys(
        JSON.parse(response).data.map(survey => ({
          value: survey.id,
          label: survey.name
        }))
      );
    } catch (error) {
      console.error('Failed to fetch surveys', error);
    }
  }, []);

  const fetchSurveyQuestions = useCallback(async (surveyId) => {
    try {
      const response = await invoke('getAllSurveyQuestions', { surveyId });
      setQuestions(
        JSON.parse(response).data.map(question => ({
          value: `{question_${question.id}}`,
          label: question.rtxt
        }))
      );
    } catch (error) {
      console.error('Failed to fetch survey questions', error);
    }
  }, []);

  const fetchShareChannels = useCallback(async (surveyId) => {
    try {
      const response = await invoke('getAllShareChannels', { surveyId });
      setShareChannels(
        response.data.map(channel => ({
          value: channel.id,
          label: channel.name,
          type: channel.type
        }))
      );
    } catch (error) {
      console.error('Failed to fetch share channels', error);
    }
  }, []);

  return {
    surveys,
    questions,
    shareChannels,
    fetchSurveys,
    fetchSurveyQuestions,
    fetchShareChannels
  };
};

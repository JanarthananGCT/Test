import React from 'react';
import ForgeReconciler from '@forge/react';
import { useAppState } from './hooks/useAppState';
import { useJiraIntegration } from './hooks/useJiraIntegration';
import { useSurveySparrow } from './hooks/useSurveySparrow';

import AuthPage from './components/Auth';
import DashboardPage from './components/Dashboard';
import MappingConfigPage from './components/MappingConfig';
import TriggerConfigPage from './components/TriggerConfig';
import LoadingPage from './components/Loading';

import { PAGES } from './utils/constants';

const App = () => {
  const appState = useAppState();
  const jiraIntegration = useJiraIntegration();
  const surveySparrow = useSurveySparrow();

  const renderPage = () => {
    switch (appState.currentPage.id) {
      case PAGES.UNAUTHORIZED.id:
        return <AuthPage {...appState} />;
      case PAGES.DASHBOARD.id:
        return (
          <DashboardPage 
            {...appState} 
            {...jiraIntegration} 
            {...surveySparrow} 
          />
        );
      case PAGES.NEW_MAPPING.id:
        return (
          <MappingConfigPage 
            {...appState} 
            {...jiraIntegration} 
            {...surveySparrow} 
          />
        );
      case PAGES.NEW_TRIGGER.id:
        return (
          <TriggerConfigPage 
            {...appState} 
            {...jiraIntegration} 
            {...surveySparrow} 
          />
        );
      case PAGES.LOADING.id:
      default:
        return <LoadingPage />;
    }
  };

  return renderPage();
};

export default ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Button,
  Box,
  Heading,
  Inline,
  Icon,
  Image,
  Text,
  Stack,
  Select,
  SectionMessage,
  Label,
  RequiredAsterisk,
  Textfield,
  ButtonGroup,
  InlineEdit,
  SectionMessageAction,
  xcss,
  EmptyState,
  Spinner,
  Checkbox,
  Popup,
  PieChart,
  SingleValueChart,
  LineChart,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [variables, setVariables] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [jiraProjects, setJiraProjects] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [changePage, setChangePage] = useState(false);
  const [configuredTriggers, setConfiguredTriggers] = useState([]);
  const [shareChannels, setShareChannels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    page: "Loading",
    id: 6,
  });

  const [selectedConfig, setSelectedConfig] = useState({
    type: null,
    sparrowField: null,
    jiraField: null,
    defaultValue: null,
  });
  const [mappingObject, setMappingObject] = useState({
    jiraProject: null,
    survey: null,
    ticketType: null,
    fields: [],
  });
  const [trigger, setTrigger] = useState({
    jiraProject: null,
    survey: null,
    events: [],
    shareType: null,
    shareChannel: null,
  });

  const issueStatusPerTypeData = [
    {
      type: "Bugs",
      label: "Bugs",
      value: 20,
    },

    {
      type: "Tasks",
      label: "Tasks",
      value: 25,
    },
    {
      type: "Stories",
      label: "Stories",
      value: 15,
    },
    {
      type: "Epics",
      label: "Epics",
      value: 10,
    },
  ];

  const pages = [
    {
      page: "Unauthorized",
      id: 1,
    },
    {
      page: "authorized but no mappings",
      id: 2,
    },
    {
      page: "authorized and mappings",
      id: 3,
    },
    {
      page: "authorized new mapping",
      id: 4,
    },
    {
      page: "authorized new trigger",
      id: 5,
    },
    {
      page: "Loading",
      id: 6,
    },
  ];
  const ticketTypes = [
    {
      value: "Bug",
      label: "Bug",
    },
    {
      value: "Task",
      label: "Task",
    },
    {
      value: "Epic",
      label: "Epic",
    },
    {
      value: "Story",
      label: "Story",
    },
  ];
  const shareTypes = [
    {
      value: "EMAIL",
      label: "Email",
    },
    {
      value: "SMS",
      label: "SMS",
    },
    {
      value: "LINK",
      label: "Link",
    },
  ];
  const readViewContainerStyles = xcss({
    width: "300px",
    paddingInline: "space.075",
    paddingBlock: "space.150",
    borderRadius: "5px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "color.border",
    marginBlockEnd: "space.075",
  });
  const JiraEvents = [
    {
      value: "issue_created",
      label: "Issue Created",
    },
    {
      value: "issue_updated",
      label: "Issue Updated",
    },
    {
      value: "issue_deleted",
      label: "Issue Deleted",
    },
    {
      value: "task_created",
      label: "Task Created",
    },
    {
      value: "task_updated",
      label: "Task Updated",
    },
    {
      value: "task_deleted",
      label: "Task Deleted",
    },
    {
      value: "story_created",
      label: "Story Created",
    },
    {
      value: "story_updated",
      label: "Story Updated",
    },
    {
      value: "story_deleted",
      label: "Story Deleted",
    },
    {
      value: "epic_created",
      label: "Epic Created",
    },
    {
      value: "epic_updated",
      label: "Epic Updated",
    },
    {
      value: "epic_deleted",
      label: "Epic Deleted",
    },
  ];
  const DataTypes = [
    {
      value: "contact",
      label: "Contacts",
      sparrowOptions: contacts,
    },
    {
      value: "question",
      label: "Questions",
      sparrowOptions: questions,
    },
    {
      value: "variable",
      label: "Variables",
      sparrowOptions: variables,
    },
    {
      value: "expression",
      label: "Expression",
      sparrowOptions: expressions,
    },
  ];
  const JiraFields = [
    {
      value: "summary",
      label: "Summary",
      isRequired: true,
    },
    {
      value: "description",
      label: "Description",
      isRequired: true,
    },
    {
      value: "priority",
      label: "Priority",
    },
    {
      value: "labels",
      label: "Labels",
    },
    {
      value: "environment",
      label: "Environment",
    },
    {
      value: "duedate",
      label: "Due Date",
    },
  ];
  const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const checkAuthStatus = async (mappings = []) => {
    try {
      const authenticated = await invoke("getToken");
      const isObjectEmpty = (obj) => {
        return Object.keys(obj)?.length === 0;
      };
      setIsConnected(!isObjectEmpty(authenticated));
      if (!isObjectEmpty(authenticated) && mappings?.length === 0) {
        setCurrentPage({
          page: "authorized and mappings",
          id: 3,
        });
      }
      if (!isObjectEmpty(authenticated) && mappings?.length > 0) {
        setCurrentPage({
          page: "authorized and mappings",
          id: 3,
        });
      }
      if (isObjectEmpty(authenticated)) {
        setCurrentPage({
          page: "Unauthorized",
          id: 1,
        });
      }
    } catch (error) {
      console.log(error, "error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    await invoke("initSurveySparrowAuth");
   
  };

   // try {
    //   const response = await invoke("initSurveySparrowAuth");
    //   console.log(response, "response");
    //   // await setToken(
    //   //   "Bearer przi9VBIZxzlm1InLaLp21aEbEty8XXWcSTxEj9idISDUb6hEZG7NwJoBxVBCt72qKb7M6xfVIENKgqTT3aYNArQ"
    //   // );
    //   // const authenticated = await invoke("getToken");
    //   // setIsConnected(authenticated);
    //   // setChangePage(!changePage);
    // } catch (error) {
    //   console.log(error, "error");
    //   setError(error.message);
    // }
  const constructPayload = (
    jiraProject,
    issueType,
    summary,
    description,
    priority = null,
    labels = null,
    duedate = null,
    environment = null
  ) => {
    const payload = {
      fields: {
        project: { key: jiraProject },
        issuetype: { name: issueType },
        summary: summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description,
                },
              ],
            },
          ],
        },
        ...(priority && { priority: { name: priority } }),
        ...(labels && { labels: labels }),
        ...(duedate && { duedate: duedate }),
        ...(environment && { environment: environment }),
      },
    };
    const payloads = jiraProject.map((project) => {
      payload.fields.project.key = project.value;
      return payload;
    });
    return payloads;
  };
  const getAllMappingObjects = async () => {
    try {
      const response = await invoke("getMappingObject");
      setMappings(response);
      return response;
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleSaveMapping = async () => {
    try {
      const payload = constructPayload(
        mappingObject.jiraProject,
        mappingObject?.ticketType?.value,
        mappingObject.fields.find(
          (field) => field?.jiraField?.value === "summary"
        )?.sparrowField?.value,
        mappingObject.fields.find(
          (field) => field?.jiraField?.value === "description"
        )?.sparrowField?.value,
        mappingObject.fields.find(
          (field) => field?.jiraField?.value === "priority"
        )?.sparrowField?.value,
        mappingObject.fields.find(
          (field) => field?.jiraField?.value === "labels"
        )?.sparrowField?.value,
        mappingObject.fields.find(
          (field) => field?.jiraField?.value === "duedate"
        )?.sparrowField?.value,
        mappingObject.fields.find(
          (field) => field?.jiraField?.value === "environment"
        )?.sparrowField?.value
      );
      const webhookURL = await invoke("getWebTriggerUrl", {
        triggerId: "create-ticket-webtrigger",
      });
      const id = generateUniqueId();
      const webhookResponse = await invoke("setSurveysparrowWebhook", {
        data: {
          url: webhookURL,
          event_type: "submission_completed",
          survey_id: mappingObject.survey.value,
          http_method: "POST",
          name: `Jira_webhook_${id}`,
          payload: JSON.stringify(
            payload.map((payload) => ({ ...payload, uid: id }))
          ),
        },
      });
      const tempMappings = mappings ? [...mappings] : [];
      tempMappings.push({
        id: id,
        isEnabled: true,
        surveyId: mappingObject.survey.value,
        webhookURL: webhookURL,
        mappingObject: mappingObject,
        mappings: payload.map((payload) => ({ ...payload, uid: id })),
      });
      await invoke("storeMappingObject", {
        mappings: tempMappings,
      });
      setShowSuccessMessage(true);
      setChangePage(!changePage);
      setCurrentPage({
        page: "authorized and mappings",
        id: 3,
      });
    } catch (error) {
      console.log(error, "error");
    }
  };
  const getAllSurveys = async () => {
    const response = await invoke("getAllSurveys");
    setSurveys(
      JSON.parse(response).data.map((survey) => {
        return {
          value: survey.id,
          label: survey.name,
        };
      })
    );
  };
  const getAllQuestions = async (surveyId) => {
    const response = await invoke("getAllSurveyQuestions", {
      surveyId: surveyId,
    });
    setQuestions(
      JSON.parse(response).data.map((question) => {
        return {
          value: `{question_${question.id}}`,
          label: question.rtxt,
        };
      })
    );
  };
  const getAllExpressions = async (surveyId) => {
    const response = await invoke("getAllSurveyExpressions", {
      surveyId: surveyId,
    });
    setExpressions(
      JSON.parse(response).data?.map((expression) => {
        return {
          value: `{expression_${expression.id}}`,
          label: expression.name,
        };
      })
    );
  };
  const getAllVariables = async (surveyId) => {
    const response = await invoke("getAllSurveyVariables", {
      surveyId: surveyId,
    });
    setVariables(
      JSON.parse(response).data.map((variable) => {
        return {
          value: `custom_param_${variable.name}`,
          label: variable.label,
        };
      })
    );
  };
  const getAllContacts = async () => {
    const response = await invoke("getAllSurveyContacts");
    setContacts(
      JSON.parse(response).data?.map((contact) => {
        return {
          value: `{contact_${contact.name}}`,
          label: contact.label,
        };
      })
    );
  };
  const getAllShareChannels = async (surveyId) => {
    const response = await invoke("getAllShareChannels", {
      surveyId: surveyId,
    });
    setShareChannels(
      response.data.map((channel) => {
        return {
          value: channel.id,
          label: channel.name,
          type: channel.type,
        };
      })
    );
    return response;
  };
  const getTriggerById = async (triggerId) => {
    const response = await invoke("getTriggersById", {
      id: triggerId,
    });
    return response;
  };
  const getAllJiraProjects = async () => {
    const response = await invoke("getAllJiraProjects");
    setJiraProjects(
      response.values.map((project) => {
        return {
          value: project.key,
          label: project.name,
        };
      })
    );
  };
  const handleSaveTrigger = async () => {
    let existingTriggers = [...configuredTriggers];
    if (trigger.id) {
      existingTriggers = existingTriggers.map((t) =>
        t.id === trigger.id ? trigger : t
      );
    } else {
      existingTriggers.push({
        ...trigger,
        id: generateUniqueId(),
        isEnabled: true,
      });
    }
    await invoke("saveTrigger", {
      trigger: existingTriggers,
    });
    setChangePage(!changePage);
  };
  const handleLogout = async () => {
    await deleteMappingObject();
    setChangePage(!changePage);
  };
  const setToken = async (token) => {
    await invoke("setToken", { token: token });
  };
  const deleteMappingObject = async () => {
    await invoke("logout");
  };
  const initHandler = async () => {
    const response = await getAllMappingObjects();
    const authenticated = await invoke("getToken");
    const isObjectEmpty = (obj) => {
      return Object.keys(obj)?.length === 0;
    };
    if (!isObjectEmpty(authenticated)) {
      await getAllSurveys();
    }
    await getAllJiraProjects();
    await checkAuthStatus(response);
  };
  const getAllTriggers = async () => {
    const response = await invoke("getTrigger");
    console.log(response, "response");
    setConfiguredTriggers(response.length ? response : []);
  };
  const getMappingsById = async () => {
    const response = await invoke("getMappingsById", {
      id: 1000141262,
    });
  };
  const disableMappingsById = async (webhookId) => {
    const response = await invoke("disableMappingsById", {
      id: webhookId,
    });
    return response;
  };
  const disableTriggerById = async (triggerId) => {
    const response = await invoke("disableTrigger", {
      id: triggerId,
    });
    return response;
  };
  const enableTriggerById = async (triggerId) => {
    const response = await invoke("enableTrigger", {
      id: triggerId,
    });
    return response;
  };
  const deleteTriggerById = async (triggerId) => {
    const response = await invoke("deleteTriggerById", {
      id: triggerId,
    });
    return response;
  };
  const enableMappingsById = async (webhookId) => {
    const response = await invoke("enableMappingsById", {
      id: webhookId,
    });
    return response;
  };
  // useEffect(() => {
  //   handleLogout()
  // }, []);
  useEffect(() => {
    getAllMappingObjects();
    getAllTriggers();
  }, [isConnected]);
  useEffect(() => {
    setCurrentPage({
      page: "Loading",
      id: 6,
    });
    initHandler();
  }, [changePage]);
  useEffect(() => {
    if (mappingObject.survey && isConnected) {
      getAllQuestions(mappingObject.survey.value);
      getAllExpressions(mappingObject.survey.value);
      getAllVariables(mappingObject.survey.value);
      getAllContacts(mappingObject.survey.value);
      getAllShareChannels(mappingObject.survey.value);
    }
  }, [mappingObject.survey]);
  useEffect(() => {
    if (showSuccessMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage]);
  useEffect(() => {
    if (trigger.survey && isConnected) {
      getAllShareChannels(trigger.survey.value);
    }
  }, [trigger.survey]);

  return (
    <Box xcss={{ width: "100%" }}>
      {error && (
        <SectionMessage appearance="error">
          <Text>Success</Text>
        </SectionMessage>
      )}
      {currentPage.id === 2 && (
        <>
          <Box
            xcss={{
              width: "100%",
              margin: "space.300",
            }}
          >
            <Inline spread="space-between" shouldWrap>
              <Box>
                <Inline
                  alignBlock="center"
                  alignInline="center"
                  space="space.100"
                >
                  <Box
                    xcss={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <Image src="https://appnest-app.salesparrow.com/SurveyMigrationTest-4119/version_1.0/icon/Color.png" />
                  </Box>
                  <Heading as="h3">Surveysparrow</Heading>

                  <Button
                    onClick={() => console.log("5678")}
                    appearance="subtle"
                  >
                    <Icon glyph="info" label="info" size="small" />
                  </Button>
                </Inline>
              </Box>
            </Inline>
            <Box
              xcss={{
                width: "90%",
                marginBlockStart: "space.500",
              }}
            >
              <Box
                xcss={{
                  marginBlockStart: "space.100",
                  marginBlockEnd: "space.200",
                  width: "100%",
                  height: "300px",
                  backgroundColor: "color.background.input.hovered",
                }}
              >
                <Box
                  xcss={{
                    padding: "space.200",
                  }}
                >
                  <Inline spread="space-between" shouldWrap>
                    <Heading as="h4">Sync survey responses to Jira</Heading>
                    <Button
                      iconAfter="add"
                      appearance="primary"
                      onClick={() =>
                        setCurrentPage({
                          page: "authorized new mapping",
                          id: 4,
                        })
                      }
                    >
                      New Mapping
                    </Button>
                  </Inline>
                  <Box
                    xcss={{
                      width: "100%",
                      height: "100px",
                      paddingBlockStart: "space.500",
                    }}
                  >
                    <Box xcss={{ paddingBlockStart: "space.200" }}>
                      <Inline
                        alignInline="center"
                        space="space.100"
                        alignBlock="center"
                      >
                        <Icon glyph="info" label="info" size="large" />
                      </Inline>
                    </Box>
                    <EmptyState header="You haven't created any mappings yet." />
                  </Box>
                </Box>
              </Box>
              <Box
                xcss={{
                  marginBlockStart: "space.100",
                  marginBlockEnd: "space.200",
                  width: "100%",
                  height: "300px",
                  backgroundColor: "color.background.input.hovered",
                }}
              >
                <Box
                  xcss={{
                    padding: "space.200",
                  }}
                >
                  <Inline spread="space-between" shouldWrap>
                    <Heading as="h4">
                      Trigger survey when an event happens in Jira
                    </Heading>
                    <Button
                      iconAfter="add"
                      appearance="primary"
                      onClick={() =>
                        setCurrentPage({
                          page: "authorized new trigger",
                          id: 5,
                        })
                      }
                    >
                      New Trigger
                    </Button>
                  </Inline>
                  <Box
                    xcss={{
                      width: "100%",
                      height: "100px",
                      paddingBlockStart: "space.500",
                    }}
                  >
                    <Box xcss={{ paddingBlockStart: "space.200" }}>
                      <Inline
                        alignInline="center"
                        space="space.100"
                        alignBlock="center"
                      >
                        <Icon glyph="info" label="info" size="large" />
                      </Inline>
                    </Box>
                    <EmptyState header="You haven't Configured any triggers yet." />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      {currentPage.id === 1 && (
        <Box
          xcss={{
            margin: "space.300",
            marginBlock: "space.500",
            width: "90%",
          }}
        >
          <Inline spread="space-between" shouldWrap>
            <Box>
              <Inline alignInline="center" space="space.200">
                <Box
                  xcss={{
                    width: "180px",
                    height: "180px",
                  }}
                >
                  <Image src="https://appnest-app.salesparrow.com/SurveyMigrationTest-4119/version_1.0/icon/Color.png" />
                </Box>
                <Box xcss={{ marginBlockStart: "space.50" }}>
                  <Inline
                    alignBlock="center"
                    // alignInline="center"
                    space="space.100"
                  >
                    <Heading as="h3">Surveysparrow</Heading>

                    <Button
                      onClick={() => console.log("5678")}
                      appearance="subtle"
                    >
                      <Icon glyph="info" label="info" size="small" />
                    </Button>
                  </Inline>
                  <Box
                    xcss={{
                      marginBlockStart: "space.100",
                      marginBlockEnd: "space.200",
                    }}
                  >
                    <Text>
                      Connect your Surveysparrow account to start using the
                      integration and streamline your workflow across platforms
                      surveysparrow account to start using the integration and
                      streamline your workflow across platforms Surveysparrow
                      account to
                    </Text>
                  </Box>
                  <Button
                    size="small"
                    iconAfter="shortcut"
                    appearance="primary"
                    onClick={handleConnect}
                    isLoading={loading}
                  >
                    Connect
                  </Button>
                </Box>
              </Inline>
            </Box>
          </Inline>
          <Box
            xcss={{
              marginBlock: "space.200",
            }}
          >
            <Heading as="h4">GETTING STARTED</Heading>
          </Box>
          <Box
            xcss={{
              marginBlock: "space.200",
            }}
          >
            <Box
              xcss={{
                marginBlockStart: "space.100",
                marginBlockEnd: "space.200",
              }}
            >
              <Inline
                space="space.100"
                alignBlock="center"
                alignInline="center"
              >
                <Icon glyph="check-circle" label="check-circle" />
                <Text>
                  Connect your Surveysparrow account to start using the
                  integration and streamline your workflow across platforms
                  surveysparrow account to start using the integration and
                  streamline your workflow across platforms Surveysparrow
                  account to
                </Text>
              </Inline>
              <Inline
                space="space.100"
                alignBlock="center"
                alignInline="center"
              >
                <Icon glyph="check-circle" label="check-circle" />
                <Text>
                  Connect your Surveysparrow account to start using the
                  integration and streamline your workflow across platforms
                  surveysparrow account to start using the integration and
                  streamline your workflow across platforms Surveysparrow
                  account to
                </Text>
              </Inline>
              <Inline alignBlock="center" alignInline="center">
                <Box
                  xcss={{
                    marginBlock: "space.300",
                    minWidth: "300px",
                    minHeight: "300px",
                  }}
                >
                  <Image src="https://static.surveysparrow.com/site/assets/integrations/inner/microsoft/v2/create-and-share-chat-surveys-directly-from-teams.png" />
                </Box>
              </Inline>
              <Inline
                space="space.100"
                alignBlock="center"
                alignInline="center"
              >
                <Icon glyph="check-circle" label="check-circle" />
                <Text>
                  Connect your Surveysparrow account to start using the
                  integration and streamline your workflow across platforms
                  surveysparrow account to start using the integration and
                  streamline your workflow across platforms Surveysparrow
                  account to
                </Text>
              </Inline>
              <Inline
                space="space.100"
                alignBlock="center"
                alignInline="center"
              >
                <Icon glyph="check-circle" label="check-circle" />
                <Text>
                  Connect your Surveysparrow account to start using the
                  integration and streamline your workflow across platforms
                  surveysparrow account to start using the integration and
                  streamline your workflow across platforms Surveysparrow
                  account to
                </Text>
              </Inline>
              <Inline
                space="space.100"
                alignBlock="center"
                alignInline="center"
              >
                <Icon glyph="check-circle" label="check-circle" />
                <Text>
                  Connect your Surveysparrow account to start using the
                  integration and streamline your workflow across platforms
                  surveysparrow account to start using the integration and
                  streamline your workflow across platforms Surveysparrow
                  account to
                </Text>
              </Inline>
              <Inline alignBlock="center" alignInline="center">
                <Box
                  xcss={{
                    marginBlock: "space.300",
                    minWidth: "300px",
                    minHeight: "300px",
                  }}
                >
                  <Image src="https://static.surveysparrow.com/site/assets/integrations/inner/microsoft/v2/create-and-share-chat-surveys-directly-from-teams.png" />
                </Box>
              </Inline>
            </Box>
          </Box>
        </Box>
      )}
      {currentPage.id === 3 && (
        <Box
          xcss={{
            width: "100%",
            margin: "space.500",
          }}
        >
          <Box xcss={{ width: "90%" }}>
            <Inline spread="space-between" shouldWrap>
              <Box>
                <Inline alignBlock="center" space="space.100">
                  <Box
                    xcss={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <Image src="https://appnest-app.salesparrow.com/SurveyMigrationTest-4119/version_1.0/icon/Color.png" />
                  </Box>
                  <Heading as="h3">Surveysparrow</Heading>

                  <Button
                    onClick={() => console.log("5678")}
                    appearance="subtle"
                  >
                    <Icon glyph="info" label="info" size="small" />
                  </Button>
                </Inline>
              </Box>

              <Button appearance="subtle" onClick={handleLogout}>
                <Icon
                  glyph="question-circle"
                  label="question-circle"
                  primaryColor="color.icon.danger"
                  size="medium"
                />
              </Button>
            </Inline>
          </Box>

          <Box xcss={{ width: "90%", marginBlock: "space.300" }}>
            <Box
              xcss={{
                marginBlockStart: "space.300",
                marginBlockEnd: "space.300",
              }}
            >
              <Box>
                <Heading as="h4">SPARROW DASHBOARD</Heading>
              </Box>
              <Box xcss={{ marginBlock: "space.100" }}>
                <Text
                  color="color.text.discovery"
                  xcss={{ color: "color.text.accent.gray" }}
                >
                  This comprehensive dashboard provides a detailed overview of
                  the performance and efficiency of our IT Service Management
                  (ITSM) team. Here, you will find a collection of insightful
                  charts and metrics that highlight key aspects of our issue
                  resolution process.
                </Text>
              </Box>
              <Box xcss={{ marginBlock: "space.200" }}>
                <Box xcss={{ marginBlock: "space.500" }}>
                  <Stack grow="fill">
                    <Inline space="space.400" spread="space-between">
                      <Stack grow="fill">
                        <SingleValueChart
                          title="Tickets Created"
                          data={[20, 40]}
                          showBorder={true}
                        />
                      </Stack>
                      <Stack grow="fill">
                        <SingleValueChart
                          title="Events Triggered"
                          data={[34, 52]}
                          showBorder={true}
                        />
                      </Stack>
                      <Stack grow="fill">
                        <SingleValueChart
                          title="Average Fallback in Ticket creation"
                          data={[39, 37]}
                          showBorder={true}
                        />
                      </Stack>
                    </Inline>
                  </Stack>
                </Box>
                <Box xcss={{ marginBlock: "space.500" }}>
                  <Stack grow="fill">
                    <Inline space="space.400" spread="space-between">
                      <Stack grow="fill">
                        <PieChart
                          data={issueStatusPerTypeData}
                          colorAccessor="type"
                          labelAccessor="label"
                          valueAccessor="value"
                          title="Type of issues reported"
                          subtitle="Total issues reported grouped by type"
                          showMarkLabels={true}
                          showBorder={true}
                        />
                      </Stack>
                      <Stack grow="fill">
                        <Box
                          xcss={{
                            padding: "space.200",
                            minHeight: "630px",
                            height: "auto",
                            borderWidth: "1px",
                            borderColor: "color.border.disabled",
                            borderStyle: "solid",
                            borderRadius: "space.200",
                          }}
                        >
                          <Box xcss={{ marginBlockEnd: "space.200" }}>
                            <Inline alignInline="center" spread="space-between">
                              <Heading as="h4">Mappings and Triggers</Heading>
                              {configuredTriggers?.length ||
                              mappings?.length ? (
                                <Popup
                                  isOpen={isOpen}
                                  onClose={() => setIsOpen(false)}
                                  placement="bottom-start"
                                  content={() => (
                                    <Box
                                      xcss={{
                                        width: "150px",
                                      }}
                                    >
                                      <Stack>
                                        <Button
                                          appearance="subtle"
                                          shouldFitContainer
                                          onClick={() => {
                                            setIsOpen(!isOpen);
                                            setCurrentPage({
                                              page: "authorized new mapping",
                                              id: 4,
                                            });
                                          }}
                                        >
                                          <Inline alignInline="start">
                                            New Mapping
                                          </Inline>
                                        </Button>
                                        <Button
                                          appearance="subtle"
                                          shouldFitContainer
                                          onClick={() => {
                                            setIsOpen(!isOpen);
                                            setCurrentPage({
                                              page: "authorized new trigger",
                                              id: 5,
                                            });
                                          }}
                                        >
                                          <Inline alignInline="start">
                                            {" "}
                                            New Trigger
                                          </Inline>
                                        </Button>
                                      </Stack>
                                    </Box>
                                  )}
                                  trigger={() => (
                                    <Button
                                      appearance="primary"
                                      iconAfter="chevron-down"
                                      size="small"
                                      onClick={() => setIsOpen(!isOpen)}
                                    >
                                      Add New
                                    </Button>
                                  )}
                                />
                              ) : null}
                            </Inline>
                          </Box>
                          {!configuredTriggers.length && !mappings.length ? (
                            <Box
                              xcss={{
                                marginBlockStart: "space.500",
                                width: "100%",
                              }}
                            >
                              <Inline alignBlock="center" alignInline="center">
                                <Stack
                                  space="space.075"
                                  alignBlock="center"
                                  alignInline="center"
                                >
                                  <Box
                                    xcss={{ width: "150px", height: "150px" }}
                                  >
                                    <Image src="https://developer.atlassian.com//console/assets/assets/SearchNoResults.ae017adfe3f389e4be72.svg" />
                                  </Box>
                                  <Box>
                                    <Heading as="h4">No Datas Found</Heading>
                                  </Box>
                                  <Box xcss={{ marginBlockEnd: "space.075" }}>
                                    <Text>
                                      Create a Trigger/Mapping to automatically
                                      share Surveysparrow data to Jira
                                    </Text>
                                    <Inline alignInline="center">
                                      <Text>when a jira event is happened</Text>
                                    </Inline>
                                  </Box>
                                  <Popup
                                    isOpen={isOpen}
                                    onClose={() => setIsOpen(false)}
                                    placement="bottom-start"
                                    content={() => (
                                      <Box
                                        xcss={{
                                          paddingBlock: "space.100",
                                          width: "150px",
                                        }}
                                      >
                                        <Stack>
                                          <Button
                                            appearance="subtle"
                                            shouldFitContainer
                                            onClick={() => {
                                              setIsOpen(!isOpen);
                                              setCurrentPage({
                                                page: "authorized new mapping",
                                                id: 4,
                                              });
                                            }}
                                          >
                                            <Inline alignInline="start">
                                              New Mapping
                                            </Inline>
                                          </Button>
                                          <Button
                                            appearance="subtle"
                                            shouldFitContainer
                                            onClick={() => {
                                              setIsOpen(!isOpen);
                                              setCurrentPage({
                                                page: "authorized new trigger",
                                                id: 5,
                                              });
                                            }}
                                          >
                                            <Inline alignInline="start">
                                              {" "}
                                              New Trigger
                                            </Inline>
                                          </Button>
                                        </Stack>
                                      </Box>
                                    )}
                                    trigger={() => (
                                      <Button
                                        appearance="primary"
                                        iconAfter="chevron-down"
                                        size="small"
                                        onClick={() => setIsOpen(!isOpen)}
                                      >
                                        Add New
                                      </Button>
                                    )}
                                  />
                                </Stack>
                              </Inline>
                            </Box>
                          ) : (
                            <Stack space="space.300">
                              {configuredTriggers?.map((trigger) => (
                                <SectionMessage
                                  title={`Trigger For ${trigger.survey.label}`}
                                  appearance="discovery"
                                  actions={[
                                    <SectionMessageAction
                                      onClick={async () => {
                                        const response = await getTriggerById(
                                          trigger.id
                                        );
                                        setTrigger(response);
                                        setCurrentPage({
                                          page: "authorized edit trigger",
                                          id: 5,
                                        });
                                      }}
                                    >
                                      <Icon
                                        glyph="edit"
                                        label="edit"
                                        size="small"
                                      />
                                      Edit Trigger
                                    </SectionMessageAction>,
                                    <SectionMessageAction
                                      onClick={async () => {
                                        await deleteTriggerById(trigger.id);
                                        setChangePage(!changePage);
                                      }}
                                    >
                                      Delete
                                    </SectionMessageAction>,
                                    <SectionMessageAction
                                      onClick={async () => {
                                        if (trigger.isEnabled) {
                                          await disableTriggerById(trigger.id);
                                        } else {
                                          await enableTriggerById(trigger.id);
                                        }
                                        setChangePage(!changePage);
                                      }}
                                    >
                                      {trigger.isEnabled ? "Disable" : "Enable"}
                                    </SectionMessageAction>,
                                  ]}
                                >
                                  <Text>
                                    Jira Project: {trigger.jiraProject.label}
                                  </Text>
                                </SectionMessage>
                              ))}
                              {mappings?.map((mapping) => (
                                <SectionMessage
                                  title={`Mapping For ${
                                    surveys.find(
                                      (survey) =>
                                        survey.value === mapping.surveyId
                                    )?.label
                                  }`}
                                  appearance="information"
                                  actions={[
                                    <SectionMessageAction href="#">
                                      <Icon
                                        glyph="edit"
                                        label="edit"
                                        size="small"
                                      />
                                      Edit Mapping
                                    </SectionMessageAction>,
                                    <SectionMessageAction
                                      onClick={async () => {
                                        await invoke("deleteMappingsById", {
                                          id: mapping.id,
                                        });
                                        setChangePage(!changePage);
                                        setShowSuccessMessage(true);
                                      }}
                                    >
                                      Delete
                                    </SectionMessageAction>,
                                    <SectionMessageAction
                                      onClick={async () => {
                                        if (!mapping.isEnabled) {
                                          await enableMappingsById(mapping.id);
                                        } else {
                                          await disableMappingsById(mapping.id);
                                        }
                                        setChangePage(!changePage);
                                      }}
                                    >
                                      {mapping.isEnabled ? "Disable" : "Enable"}
                                    </SectionMessageAction>,
                                  ]}
                                >
                                  <Text>
                                    Jira Project:{" "}
                                    {mapping.mappings
                                      .map(
                                        (m) =>
                                          jiraProjects.find(
                                            (p) =>
                                              p.value === m.fields.project.key
                                          )?.label
                                      )
                                      .join(", ")}
                                  </Text>
                                </SectionMessage>
                              ))}
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </Inline>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {currentPage.id === 4 && (
        <>
          <Box
            xcss={{
              width: "100%",
              margin: "space.300",
            }}
          >
            <Inline spread="space-between" shouldWrap>
              <Box>
                <Inline
                  alignBlock="center"
                  alignInline="center"
                  space="space.100"
                >
                  <Box
                    xcss={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <Image src="https://appnest-app.salesparrow.com/SurveyMigrationTest-4119/version_1.0/icon/Color.png" />
                  </Box>
                  <Heading as="h3">Surveysparrow</Heading>

                  <Button
                    onClick={() => console.log("5678")}
                    appearance="subtle"
                  >
                    <Icon glyph="info" label="info" size="small" />
                  </Button>
                </Inline>
              </Box>
            </Inline>
            <Box
              xcss={{
                marginBlock: "space.300",
                width: "300px",
              }}
            >
              <Box
                xcss={{
                  marginBlock: "space.200",
                }}
              >
                <Heading as="h4">CONFIGURE MAPPING</Heading>
              </Box>
              <Stack space="space.200">
                <Box>
                  <Label labelFor="select">
                    Jira Project
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    isMulti={true}
                    onChange={(e) => {
                      const temp = {
                        ...mappingObject,
                        jiraProject: e,
                      };
                      setMappingObject(temp);
                    }}
                    options={jiraProjects}
                    inputId="select"
                    placeholder="Choose project"
                  />
                </Box>
                <Box>
                  <Label labelFor="select">
                    Survey
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    onChange={(e) => {
                      const temp = {
                        ...mappingObject,
                        survey: e,
                      };
                      setMappingObject(temp);
                    }}
                    options={surveys}
                    inputId="select"
                    placeholder="Choose survey"
                  />
                </Box>
                <Box>
                  <Label labelFor="select">
                    Ticket Type
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    onChange={(e) => {
                      const temp = {
                        ...mappingObject,
                        ticketType: e,
                      };
                      setMappingObject(temp);
                    }}
                    options={ticketTypes}
                    inputId="select"
                    placeholder="Choose ticket type"
                  />
                </Box>
              </Stack>
            </Box>
            {mappingObject.survey &&
              mappingObject.jiraProject &&
              mappingObject.ticketType && (
                <>
                  <Box
                    xcss={{
                      marginBlockStart: "space.400",
                      marginBlockEnd: "space.100",
                    }}
                  >
                    <Heading as="h5">MAP YOUR JIRA FIELDS</Heading>
                  </Box>
                  {JiraFields.filter((field) => field.isRequired).map(
                    (field) => (
                      <Box xcss={{ width: "90%", marginBlockEnd: "space.300" }}>
                        <Inline
                          space="space.200"
                          alignBlock="center"
                          shouldWrap
                        >
                          <Box xcss={{ width: "300px" }}>
                            <Label labelFor="select">
                              Type
                              <RequiredAsterisk />
                            </Label>
                            <Select
                              onChange={(e) => {
                                const temp = {
                                  type: e,
                                  sparrowField: null,
                                  jiraField: field,
                                  defaultValue: null,
                                };
                                setSelectedConfig(temp);
                                setMappingObject((prevMapping) => ({
                                  ...prevMapping,
                                  fields: [...prevMapping.fields, temp],
                                }));
                              }}
                              inputId="select"
                              options={DataTypes}
                              placeholder="Choose type"
                            />
                          </Box>
                          <Box xcss={{ width: "300px" }}>
                            <Label labelFor="select">
                              Sparrow Field
                              <RequiredAsterisk />
                            </Label>
                            <Select
                              onChange={(e) => {
                                const temp = {
                                  ...selectedConfig,
                                  sparrowField: e,
                                };
                                setSelectedConfig(temp);
                                setMappingObject((prevMapping) => ({
                                  ...prevMapping,
                                  fields: prevMapping.fields.map((field) =>
                                    field.jiraField === selectedConfig.jiraField
                                      ? temp
                                      : field
                                  ),
                                }));
                              }}
                              inputId="select"
                              options={
                                selectedConfig?.type?.sparrowOptions ?? []
                              }
                              placeholder="Choose Sparrow field"
                            />
                          </Box>
                          <Box xcss={{ width: "300px" }}>
                            <Label labelFor="select">
                              Jira Field
                              <RequiredAsterisk />
                            </Label>
                            <Select
                              value={field}
                              isDisabled={field.isRequired}
                              onChange={(e) => {
                                const temp = {
                                  ...selectedConfig,
                                  jiraField: e,
                                };
                                setSelectedConfig(temp);
                                setMappingObject((prevMapping) => ({
                                  ...prevMapping,
                                  fields: prevMapping.fields.map((field) =>
                                    field.jiraField === selectedConfig.jiraField
                                      ? temp
                                      : field
                                  ),
                                }));
                              }}
                              inputId="select"
                              options={JiraFields}
                              placeholder="Choose Jira field"
                            />
                          </Box>
                          <Box xcss={{ width: "300px" }}>
                            <InlineEdit
                              defaultValue={selectedConfig.defaultValue}
                              label="Default Value"
                              editView={({ errorMessage, ...fieldProps }) => (
                                <Textfield {...fieldProps} autoFocus />
                              )}
                              readView={() => (
                                <Box xcss={readViewContainerStyles}>
                                  {selectedConfig.defaultValue ||
                                    "Enter Default Value"}
                                </Box>
                              )}
                              onConfirm={(value) => {
                                const temp = {
                                  ...selectedConfig,
                                  defaultValue: value,
                                };
                                setSelectedConfig(temp);
                                setMappingObject((prevMapping) => ({
                                  ...prevMapping,
                                  fields: prevMapping.fields.map((field) =>
                                    field.jiraField === selectedConfig.jiraField
                                      ? temp
                                      : field
                                  ),
                                }));
                              }}
                            />
                          </Box>
                        </Inline>
                      </Box>
                    )
                  )}
                  {additionalFields.map((field) => (
                    <Box xcss={{ width: "100%", marginBlock: "space.300" }}>
                      <Inline space="space.200" alignBlock="center" shouldWrap>
                        <Box xcss={{ width: "300px" }}>
                          <Label labelFor="select">
                            Type
                            <RequiredAsterisk />
                          </Label>
                          <Select
                            onChange={(e) => {
                              const temp = {
                                type: e,
                                sparrowField: null,
                                jiraField: null,
                                defaultValue: null,
                              };
                              setSelectedConfig(temp);
                              setMappingObject((prevMapping) => ({
                                ...prevMapping,
                                fields: [...prevMapping.fields, temp],
                              }));
                            }}
                            inputId="select"
                            options={DataTypes}
                            placeholder="Choose type"
                          />
                        </Box>
                        <Box xcss={{ width: "300px" }}>
                          <Label labelFor="select">
                            Sparrow Field
                            <RequiredAsterisk />
                          </Label>
                          <Select
                            onChange={(e) => {
                              const temp = {
                                ...selectedConfig,
                                sparrowField: e,
                              };
                              setSelectedConfig(temp);
                              setMappingObject((prevMapping) => ({
                                ...prevMapping,
                                fields: prevMapping.fields.map((field) =>
                                  field.jiraField === selectedConfig.jiraField
                                    ? temp
                                    : field
                                ),
                              }));
                            }}
                            inputId="select"
                            options={selectedConfig?.type?.sparrowOptions ?? []}
                            placeholder="Choose Sparrow field"
                          />
                        </Box>
                        <Box xcss={{ width: "300px" }}>
                          <Label labelFor="select">
                            Jira Field
                            <RequiredAsterisk />
                          </Label>
                          <Select
                            onChange={(e) => {
                              const temp = {
                                ...selectedConfig,
                                jiraField: e,
                              };
                              setSelectedConfig(temp);
                              setMappingObject((prevMapping) => ({
                                ...prevMapping,
                                fields: prevMapping.fields.map((field) =>
                                  field.jiraField === selectedConfig.jiraField
                                    ? temp
                                    : field
                                ),
                              }));
                            }}
                            inputId="select"
                            options={JiraFields.filter(
                              (field) => !field.isRequired
                            )}
                            placeholder="Choose Jira field"
                          />
                        </Box>
                        <Box xcss={{ width: "300px" }}>
                          <InlineEdit
                            defaultValue={selectedConfig.defaultValue}
                            label="Default Value"
                            editView={({ errorMessage, ...fieldProps }) => (
                              <Textfield {...fieldProps} autoFocus />
                            )}
                            readView={() => (
                              <Box xcss={readViewContainerStyles}>
                                {selectedConfig.defaultValue ||
                                  "Enter Default Value"}
                              </Box>
                            )}
                            onConfirm={(value) => {
                              const temp = {
                                ...selectedConfig,
                                defaultValue: value,
                              };
                              setSelectedConfig(temp);
                            }}
                          />
                        </Box>

                        <Box
                          xcss={{
                            marginInlineStart: "space.100",
                            marginBlockStart: "space.200",
                          }}
                        >
                          <Button
                            appearance="subtle"
                            size="medium"
                            onClick={() => {
                              setAdditionalFields(
                                additionalFields.filter(
                                  (fields) => fields.id !== field.id
                                )
                              );
                            }}
                          >
                            <Icon glyph="trash" label="trash" />
                          </Button>
                        </Box>
                      </Inline>
                    </Box>
                  ))}

                  <Inline alignInline="center">
                    <Box xcss={{ marginBlock: "space.300" }}>
                      <Button
                        iconBefore="add"
                        appearance="default"
                        isLoading={loading}
                        onClick={() => {
                          setAdditionalFields([
                            ...additionalFields,
                            {
                              id: additionalFields.length + 1,
                            },
                          ]);
                        }}
                      >
                        Add Another
                      </Button>
                    </Box>
                  </Inline>
                  <ButtonGroup size="medium" label="Default button group">
                    <Button
                      size="medium"
                      appearance="primary"
                      onClick={handleSaveMapping}
                    >
                      Save Mapping
                    </Button>
                    <Button
                      onClick={() => {
                        setChangePage(!changePage);
                      }}
                      size="medium"
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </>
              )}
          </Box>
        </>
      )}
      {currentPage.id === 5 && (
        <>
          <Box
            xcss={{
              width: "90%",
              margin: "space.500",
              height: "80vh",
            }}
          >
            <Inline spread="space-between" shouldWrap>
              <Box>
                <Inline
                  alignBlock="center"
                  alignInline="center"
                  space="space.100"
                >
                  <Box
                    xcss={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <Image src="https://appnest-app.salesparrow.com/SurveyMigrationTest-4119/version_1.0/icon/Color.png" />
                  </Box>
                  <Heading as="h3">Surveysparrow</Heading>

                  <Button
                    onClick={() => console.log("5678")}
                    appearance="subtle"
                  >
                    <Icon glyph="info" label="info" size="small" />
                  </Button>
                </Inline>
              </Box>
            </Inline>
            <Box
              xcss={{
                marginBlock: "space.300",
              }}
            >
              <Box
                xcss={{
                  marginBlock: "space.200",
                }}
              >
                <Heading as="h4">CONFIGURE TRIGGERS</Heading>
              </Box>
              <Stack space="space.200">
                <Box>
                  <Label labelFor="select">
                    Jira Project
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    onChange={(e) => {
                      const temp = {
                        ...trigger,
                        jiraProject: e,
                      };
                      setTrigger(temp);
                    }}
                    value={trigger.jiraProject}
                    options={jiraProjects}
                    inputId="select"
                    placeholder="Choose project"
                  />
                </Box>
                <Box>
                  <Label labelFor="select">
                    Survey
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    value={trigger.survey}
                    onChange={(e) => {
                      const temp = {
                        ...trigger,
                        survey: e,
                      };
                      setTrigger(temp);
                    }}
                    options={surveys}
                    inputId="select"
                    placeholder="Choose survey"
                  />
                </Box>
                <Box
                  xcss={{
                    width: "100%",
                  }}
                >
                  <Heading as="h5">SELECT JIRA EVENTS</Heading>
                  <Box xcss={{ width: "70%", marginBlock: "space.300" }}>
                    <Inline alignBlock="center" space="space.200" shouldWrap>
                      {JiraEvents.map((event) => (
                        <Checkbox
                          isChecked={
                            trigger?.events?.filter(
                              (e) => e?.value === event?.value
                            )?.length > 0
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const temp = {
                                ...trigger,
                                events: [...trigger.events, event],
                              };
                              setTrigger(temp);
                            } else {
                              const temp = {
                                ...trigger,
                                events: trigger.events.filter(
                                  (e) => e?.value !== event?.value
                                ),
                              };
                              setTrigger(temp);
                            }
                          }}
                          value={
                            trigger?.events?.filter(
                              (e) => e?.value === event?.value
                            )?.length > 0
                              ? true
                              : false
                          }
                          id={event.value}
                          label={event.label}
                        />
                      ))}
                    </Inline>
                  </Box>
                </Box>
                <Box
                  xcss={{
                    width: "300px",
                  }}
                >
                  <Heading as="h5">CONFIGURE SURVEY SHARE</Heading>
                </Box>
                <Box xcss={{ width: "300px" }}>
                  <Label labelFor="select">
                    Share Type
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    value={trigger.shareType}
                    onChange={(e) => {
                      const temp = {
                        ...trigger,
                        shareType: e,
                      };
                      setTrigger(temp);
                    }}
                    options={shareTypes}
                    inputId="select"
                    placeholder="Choose share type"
                  />
                </Box>
                <Box xcss={{ width: "300px" }}>
                  <Label labelFor="select">
                    Share Channel
                    <RequiredAsterisk />
                  </Label>
                  <Select
                    value={trigger.shareChannel}
                    isDisabled={!trigger.shareType}
                    onChange={(e) => {
                      const temp = {
                        ...trigger,
                        shareChannel: e,
                      };
                      setTrigger(temp);
                    }}
                    options={shareChannels.filter(
                      (channel) => channel.type === trigger.shareType?.value
                    )}
                    inputId="select"
                    placeholder="Choose share channel"
                  />
                </Box>
                <Box xcss={{ width: "300px", marginBlockStart: "space.300" }}>
                  <ButtonGroup size="medium" label="Default button group">
                    <Button
                      size="medium"
                      appearance="primary"
                      onClick={handleSaveTrigger}
                    >
                      Save Trigger
                    </Button>
                    <Button
                      onClick={() => {
                        setChangePage(!changePage);
                      }}
                      size="medium"
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </Box>
              </Stack>
            </Box>
          </Box>
        </>
      )}
      {currentPage.id === 6 && (
        <>
          <Box
            xcss={{
              width: "90%",
              margin: "space.500",
              height: "80vh",
            }}
          >
            <Inline spread="space-between" shouldWrap>
              <Box>
                <Inline
                  alignBlock="center"
                  alignInline="center"
                  space="space.100"
                >
                  <Box
                    xcss={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <Image src="https://appnest-app.salesparrow.com/SurveyMigrationTest-4119/version_1.0/icon/Color.png" />
                  </Box>
                  <Heading as="h3">Surveysparrow</Heading>

                  <Button
                    onClick={() => console.log("5678")}
                    appearance="subtle"
                  >
                    <Icon glyph="info" label="info" size="small" />
                  </Button>
                </Inline>
              </Box>
            </Inline>
            <Box
              xcss={{
                paddingBlockStart: "space.500",
                marginBlock: "space.500",
                height: "700px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Inline alignBlock="center" alignInline="center">
                <Spinner size="large" />
              </Inline>
            </Box>
          </Box>
        </>
      )}
      {showSuccessMessage && (
        <Box xcss={{ marginBlock: "space.300", width: "30%" }}>
          <SectionMessage
            title="Mapping Saved Successfully"
            appearance="success"
            actions={[
              <SectionMessageAction onClick={() => alert("Click")}>
                Dismiss
              </SectionMessageAction>,
            ]}
          >
            <Text>Jira Project: Jira Integration Test</Text>
          </SectionMessage>
        </Box>
      )}
    </Box>
  );
};

export default ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

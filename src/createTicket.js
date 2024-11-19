import api, { route, storage } from '@forge/api';

export async function handler(req) {
  let requestPayload;
  requestPayload = JSON.parse(req.body);
  const mappings = await storage.get('mappingObject');
  const constructPayload = (
    webhookPayload,
    summary,
    description,
    priority = null,
    labels = null,
    duedate = null,
    environment = null
  ) => {
    const payload = {...JSON.parse(JSON.stringify(webhookPayload))};
    if (payload.summary === "null") {
      payload.summary = summary;
    }

    if (!payload.description || (typeof payload.description === 'object' &&
      (!payload.description.content || payload.description.content.length === 0))) {
      payload.description = {
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
      };
    }

    if (payload.priority === "null" && priority) {
      payload.priority = { name: priority };
    }

    if (payload.labels === "null" && labels) {
      payload.labels = labels;
    }

    if (payload.duedate === "null" && duedate) {
      payload.duedate = duedate;
    }

    if (payload.environment === "null" && environment) {
      payload.environment = environment;
    }
    return payload;
  };

  const transformPayload = () => {
    const currentMapping = mappings.find(mapping => mapping.id === requestPayload.uid)?.mappingObject;
    const payload = constructPayload(
      requestPayload.fields,
      currentMapping.fields.find(
        (field) => field?.jiraField?.value === "summary"
      )?.defaultValue,
      currentMapping.fields.find(
        (field) => field?.jiraField?.value === "description"
      )?.defaultValue,
      currentMapping.fields.find(
        (field) => field?.jiraField?.value === "priority"
      )?.defaultValue,
      currentMapping.fields.find(
        (field) => field?.jiraField?.value === "labels"
      )?.defaultValue,
      currentMapping.fields.find(
        (field) => field?.jiraField?.value === "duedate"
      )?.defaultValue,
      currentMapping.fields.find(
        (field) => field?.jiraField?.value === "environment"
      )?.defaultValue
    );

    return payload;
  }
  try {
    const transformedPayload = transformPayload();
    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: transformedPayload }),
    });
    const result = await response.json();
    return new Response(JSON.stringify({ success: true, issue: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

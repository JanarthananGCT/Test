import ForgeUI, {
  render,
  CustomField,
  Text,
  Button,
  Fragment,
  useState,
  Tag,
  Link,
} from '@forge/ui';

const DUMMY_SURVEY = {
  id: "SURV-123",
  name: "Customer Feedback Survey",
  status: "active",
  responses: 5,
  lastResponse: "2024-03-20T10:30:00Z",
  url: "https://surveysparrow.com/s/customer-feedback/123"
};

const CustomFieldHandler = () => {
  const [survey, setSurvey] = useState(DUMMY_SURVEY);
  const [isConnected, setIsConnected] = useState(true);

  if (!isConnected) {
    return (
      <CustomField>
        <Text>Connect SurveySparrow to get started</Text>
        <Text>
          <Button 
            text="Connect SurveySparrow" 
            appearance="primary"
            onClick={() => setIsConnected(true)}
          />
        </Text>
      </CustomField>
    );
  }

  if (!survey) {
    return (
      <CustomField>
        <Text>No survey linked to this issue</Text>
        <Text>
          <Button 
            text="Create Survey" 
            appearance="primary"
            onClick={() => setSurvey(DUMMY_SURVEY)}
          />
          {" "}
          <Button 
            text="Link Existing Survey" 
            appearance="default"
            onClick={() => setSurvey(DUMMY_SURVEY)}
          />
        </Text>
      </CustomField>
    );
  }

  return (
    <CustomField>
      {/* Survey Header */}
      <Text>
        <strong>{survey.name}</strong>
      </Text>
      <Tag text={survey.status} color={survey.status === 'active' ? 'green' : 'default'} />
      
      {/* Survey Details */}
      <Text>Survey ID: {survey.id}</Text>
      
      {/* Response Stats */}
      <Text>Total Responses: {survey.responses}</Text>
      <Text>Last Response: {new Date(survey.lastResponse).toLocaleDateString()}</Text>

      {/* Actions */}
      <Text>
        <Button 
          text="View Responses" 
          appearance="primary"
          onClick={() => console.log('View responses clicked')}
        />
        {" "}
        <Button 
          text="Copy Survey Link" 
          appearance="default"
          onClick={() => console.log('Copy link clicked')}
        />
      </Text>

      {/* External Link */}
      <Text>
        <Link href={survey.url} openInNew>
          Open in SurveySparrow →
        </Link>
      </Text>
    </CustomField>
  );
};

export const handler = render(<CustomFieldHandler />); 
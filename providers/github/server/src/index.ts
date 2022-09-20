import express, { ErrorRequestHandler } from 'express'
import { ExtensibilityError, GenericExtensibilityOperationRequest } from './models';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error: ExtensibilityError = {
    code: "UhOh",
    message: `Something unexpected happened: ${err}`,
    target: '',
  };

  res.status(400).json(error);
};

const port = 8080;
const host = '0.0.0.0';
const app = express();

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

app.use(express.json());

app.post('/Get', (req, res) => {
  const body = req.body as GenericExtensibilityOperationRequest;

  return res.json(body);
});

app.post('/Save', (req, res) => {
  const body = req.body as GenericExtensibilityOperationRequest;

  return res.json(body);
});

app.post('/PreviewSave', (req, res) => {
  const body = req.body as GenericExtensibilityOperationRequest;

  return res.json(body);
});

app.post('/Delete', (req, res) => {
  const body = req.body as GenericExtensibilityOperationRequest;

  return res.json(body);
});

app.use(errorHandler);
app.listen(port, host);

/* Test request body:
{
  "import": {
    "provider": "foo",
    "version": "1.0",
    "config": {}
  },
  "resource": {
    "type": "bar@v1",
    "properties": {}
  }
}
*/
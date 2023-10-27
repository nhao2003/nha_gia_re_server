type AppResponse = {
  status: 'success' | 'fail' | 'error';
  code: number;
  message: string;
  result?: any;
  error?: any;
};

export default AppResponse;

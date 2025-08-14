// Use direct Paystack initialization instead of the paystack-api package

interface PaystackMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

interface PaystackTransactionParams {
  amount: number;
  email: string;
  currency: string;
  reference: string;
  metadata?: PaystackMetadata;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

const paystackClient = {
  initializeTransaction: async (params: PaystackTransactionParams): Promise<PaystackResponse> => {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`Paystack error: ${response.statusText}`);
    }

    return response.json();
  }
};

export default paystackClient;
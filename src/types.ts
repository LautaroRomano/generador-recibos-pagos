export type Client = {
    id: string
    fullName: string
    email: string
  }
  
  export type Payment = {
    id: string
    clientId: string
    date: string
    amount: number
    concept: string
  }
  
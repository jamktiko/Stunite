export interface Event {
  id: number;
  eventName: string;
  date: string;
  startingTime: string;
  location: {
    venue: string;
    city: string;
    address: string;
  };
  ticketprice: {
    minticketprice: number;
    maxticketprice: number;
  };
  details: string;
  imageUrl?: string;
}

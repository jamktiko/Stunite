
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
  theme: string;
  isFavorite: boolean;
  details: string;
  imageUrl: string;
  ticketLink: string;
  ticketSaleStart: string;
  ticketSaleEnd: string;
  publishDateTime: string;
  status: string;
  organizerId: number; 
}

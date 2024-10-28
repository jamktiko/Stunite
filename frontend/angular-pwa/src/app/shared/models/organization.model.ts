export interface Organizer {
  id: string;
  organizerId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  organizationName: string;
  customerServiceEmail: string;
  organizationPhoneNumber?: string;
  website?: string;
  description?: string;
  address: string;
  postalCode: string;
  city: string;
  officialName: string;
  organizationType: string;
  businessId: string;
  billingAddress: string;
  paymentAddress: string;
  password: string;
  fieldsOfStudy?: string[];
}

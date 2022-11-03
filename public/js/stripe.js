/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51LzGrtFAZSQ8NbRZFyuRdZiWi4qiwWBaVlme6ZkT7fV6hzHg34AVTMMVWFk0OixOa2OHCAyZmCy4DxD9aXjuXqRc00p3JwBuE1'
);

export const bookTour = async (tourId) => {
  try {
    //  Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // Create checkout form and charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

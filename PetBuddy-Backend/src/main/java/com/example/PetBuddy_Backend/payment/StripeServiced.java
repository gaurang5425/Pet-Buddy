package com.example.PetBuddy_Backend.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem;

@Service
public class StripeServiced {

	 @Value("${stripe.apikey}")
	 String apikey;
	 @Value("${stripe.secretkey}")
	 String secretkey;
	 //stripe->Api
	// prodNameamount,quantity,currency
	    //return session id and url
	public StripeResponse checkoutProd(ProductRequest pr)
	{
		Stripe.apiKey=secretkey;
		 SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData.builder().setName(pr.getName()).build();
		  SessionCreateParams.LineItem.PriceData pricedata = SessionCreateParams.LineItem.PriceData.builder()
		 .setCurrency(pr.getCurrency())
	     .setUnitAmount(pr.getAmount())
	     .setProductData(productData)
	     .build();
		 LineItem lineItem = SessionCreateParams.LineItem.builder().setQuantity(pr.getQuantity()).setPriceData(pricedata).build();
		    SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl("http://localhost:5173/payment-success")
                            .setCancelUrl("http://localhost:5173/payment-failure")
                            .addLineItem(lineItem)
                            .build();

            // Create new session
            Session session = null;
            try {
                session = Session.create(params);
            } catch (StripeException e) {
                //log the error
            }
            return new StripeResponse
                    .Builder()
                    .status("SUCCESS")
                    .message("Payment session created ")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();
        }
	}


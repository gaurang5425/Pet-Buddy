package com.example.PetBuddy_Backend.payment;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/product/v1")
public class ProductCheckoutController {


    private StripeServiced stripeService;

    public ProductCheckoutController(StripeServiced stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody ProductRequest productRequest) {
        StripeResponse stripeResponse = stripeService.checkoutProd(productRequest);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(stripeResponse);
}
}
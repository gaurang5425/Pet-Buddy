package com.example.PetBuddy_Backend.payment;


public class ProductRequest {
	private Long amount;
	private Long quantity;
	private String name;
	private String currency;
	public Long getAmount() {
		return amount;
	}
	public void setAmount(Long amount) {
		this.amount = amount;
	}
	public Long getQuantity() {
		return quantity;
	}
	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}

//{
//	  "amount": 1999,
//	  "quantity": 2,
//	  "name": "Premium Dog Food",
//	  "currency":"USD"
//	}

}
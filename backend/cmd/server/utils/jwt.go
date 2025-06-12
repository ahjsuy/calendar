package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey string = os.Getenv("JWT_SECRET");

func CreateToken(userID int) (string, error){
	token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.MapClaims{
		"user_id": userID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) (int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token)(interface{}, error){
		return secretKey, nil
	})

	if err != nil {
		return 0, err
	}
	
	if !token.Valid{
		return 0, fmt.Errorf(("invalid token"))
	}

	claims := token.Claims.(jwt.MapClaims)

	return int(claims["user_id"].(float64)), nil
}
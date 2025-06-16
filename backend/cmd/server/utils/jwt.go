package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey []byte = []byte(os.Getenv("JWT_SECRET"));

func CreateToken(userID string) (string, error){
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token)(interface{}, error){
		return secretKey, nil
	})

	if err != nil {
		return "", err
	}
	
	if !token.Valid{
		return "", fmt.Errorf(("invalid token"))
	}

	claims := token.Claims.(jwt.MapClaims)

	return claims["user_id"].(string), nil
}
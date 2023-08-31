# Ethereum-Polygon Bridge

This repository contains a simple implementation of a bridge for transferring tokens between Ethereum and Polygon (formerly known as Matic) networks. The bridge is implemented using Solidity smart contracts and interacts with the networks using the ethers.js library.

## Introduction

This bridge project demonstrates how to transfer tokens between Ethereum and Polygon networks using a two-step process. The process involves initiating a bridge from one network to move tokens to reserves, waiting for the confirmation, and then initiating the bridge on the other network to transfer tokens from reserves to the desired recipient.

## Features

- Bridging tokens from Ethereum to Polygon and vice versa.
- Utilizes ethers.js library for interaction with Ethereum and Polygon networks.
- Modular structure for easy understanding and customization.


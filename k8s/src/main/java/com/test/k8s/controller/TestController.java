package com.test.k8s.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping(path = "/test")
    public ResponseEntity<Void> testCall() {
        return ResponseEntity.noContent().build();
    }
}

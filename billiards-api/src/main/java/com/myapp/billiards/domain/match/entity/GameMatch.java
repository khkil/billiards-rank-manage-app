package com.myapp.billiards.domain.match.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameMatch {
    @Id
    private Long id;

    private String matchName;

//    @CreationTimestamp
//    private LocalDateTime matchDate;
}

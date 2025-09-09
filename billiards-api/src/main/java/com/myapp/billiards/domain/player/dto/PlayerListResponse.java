package com.myapp.billiards.domain.player.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class PlayerListResponse {
    private Long playerId;
    private String playerName;
    private Rating rating;

    @QueryProjection
    public PlayerListResponse(Long playerId, String playerName, Rating rating) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.rating = rating;
    }

    @Data
    public static class Rating {
        private Integer average;
        private Integer cushion;
        private Integer points;

        @QueryProjection
        public Rating(Integer average, Integer cushion, Integer points) {
            this.average = average;
            this.cushion = cushion;
            this.points = points;
        }
    }
}

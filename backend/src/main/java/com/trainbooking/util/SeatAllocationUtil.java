package com.trainbooking.util;

import java.util.*;

public class SeatAllocationUtil {

    public static class CoachSeatInfo {
        private final String coach;
        private final int seatNumberInCoach;
        private final String berthType;

        public CoachSeatInfo(String coach, int seatNumberInCoach, String berthType) {
            this.coach = coach;
            this.seatNumberInCoach = seatNumberInCoach;
            this.berthType = berthType;
        }

        public String getCoach() {
            return coach;
        }

        public int getSeatNumberInCoach() {
            return seatNumberInCoach;
        }

        public String getBerthType() {
            return berthType;
        }
    }

    public static int getBerthsPerCoach(String classCode) {
        switch (classCode.toUpperCase()) {
            case "1A":
                return 24;
            case "2A":
                return 48;
            case "3A":
            case "SL":
            default:
                return 72;
        }
    }

    public static String getCoachPrefix(String classCode) {
        switch (classCode.toUpperCase()) {
            case "1A":
                return "H";
            case "2A":
                return "A";
            case "3A":
                return "B";
            case "SL":
            default:
                return "S";
        }
    }

    public static String getBerthType(String classCode, int seatNumberInCoach) {
        String code = classCode.toUpperCase();
        if ("1A".equals(code)) {
            int rem = seatNumberInCoach % 2;
            return (rem == 1) ? "Lower" : "Upper";
        } else if ("2A".equals(code)) {
            int rem = seatNumberInCoach % 6;
            switch (rem) {
                case 1:
                case 3:
                    return "Lower";
                case 2:
                case 4:
                    return "Upper";
                case 5:
                    return "Side Lower";
                case 0:
                default:
                    return "Side Upper";
            }
        } else { // 3A and SL
            int rem = seatNumberInCoach % 8;
            switch (rem) {
                case 1:
                case 4:
                    return "Lower";
                case 2:
                case 5:
                    return "Middle";
                case 3:
                case 6:
                    return "Upper";
                case 7:
                    return "Side Lower";
                case 0:
                default:
                    return "Side Upper";
            }
        }
    }

    public static CoachSeatInfo calculateCoachAndBerth(String classCode, int globalSeatNumber) {
        int berthsPerCoach = getBerthsPerCoach(classCode);
        String prefix = getCoachPrefix(classCode);

        int coachIndex = ((globalSeatNumber - 1) / berthsPerCoach) + 1;
        int seatInCoach = ((globalSeatNumber - 1) % berthsPerCoach) + 1;
        String coach = prefix + coachIndex;
        String berthType = getBerthType(classCode, seatInCoach);

        return new CoachSeatInfo(coach, seatInCoach, berthType);
    }

    public static String generatePNR() {
        Random random = new Random();
        StringBuilder pnr = new StringBuilder();
        // First digit 1-9
        pnr.append(random.nextInt(9) + 1);
        for (int i = 0; i < 9; i++) {
            pnr.append(random.nextInt(10));
        }
        return pnr.toString();
    }
}

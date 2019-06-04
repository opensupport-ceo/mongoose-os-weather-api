#include "pins.h"
class LED {
public:
    int frequency;
    float brightness;
    int blink_target;
    bool is_blinking;
    bool is_lighting_up;
    int tick_time;

    void ledinit();
    void initializeBrightness();
    void revertBrightness();
    void resetBrightness();
    bool setBrightness(int target, float duty);
    bool setBrightness2(float duty1, float duty2);
    bool autoblink(int target);
    bool litup (int target);
    bool litdown (int target);
    bool blink(int target);
};

extern LED led;
## DNA Devlog #3 - 6/17/2025
# Drawing DNA

## Explanation
###### [Skip to Implementation](#implementation)

To draw DNA connecting one side of the strand to the other, I need the curve's normal vector, which I explained in [my last devlog](DNA_DEVLOG_2.md). Once I have this, I draw a line from the edge to the center in one color, and repeat to the second edge in the other color.

## Implementation

I assigned colors to each DNA molecule, ATCG, giving its color and its partner's color. This was done using a simple-ish switch statement.
![Switch-case](DNA_devlog_3_switch_case.png)

I then made it draw to the screen when given a string (pun intended) of DNA.
Here is a demonstration with the string ACTGATAGCTA. As you can see, only one side of the DNA shows the data inputted, because both sides must match.
![ATCG](DNA_devlog_3_drawn.png)

[<-- Previous Devlog](DNA_DEVLOG_2.md)   [Next Devlog -->](DNA_DEVLOG_4.md)
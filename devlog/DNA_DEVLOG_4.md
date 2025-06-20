## DNA Devlog #4 - 6/19/2025
# 2 C<sub>2</sub> 4 U

## Explanation
###### [Skip to Implementation](#implementation)

Continuity, i.e. *smoothness*, is pretty important when making good-looking splines. There are different levels of continuity to achieve, but only 0% of them really matter! Only the first few are useful for practical purposes, and there are infinitely many past those that don't improve much on the previous ones.
Each level has to do with the continuity of the curve's derivatives, but that's not that important here.

In order for things to look practically smooth, the best target is C<sub>2</sub>.
A simple way to ensure C<sub>2</sub> continuity is to have the connector point between two Bézier curves be exactly in the middle of the two adjacent control points.
![Diagram](DNA_devlog_4_c2.png)

## Implementation

Now, when editing the points of each curve, the continuity is preserved, leaving the DNA strand looking smooth. I may change this to only C<sub>1</sub> if it proves too restricting, but for now it looks pretty good!
![C2 Continuity](DNA_devlog_4_continuity.mp4);
There is still an issue with sharp corners. When there is one, some artifacts are left on the corner, making it look ugly. I'll look into that later.
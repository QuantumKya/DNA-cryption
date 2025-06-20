## DNA Devlog #1 - 6/17/2025
# Starting goals - Bézier curves!

The user should be able to input a file of a reasonable size and get the data as a DNA encoding. A string of text would be boring, so I plan to make the output an image of the DNA strand. I want the DNA string to be reorientable, adding customization to the output.

The simplest way to do that, I think, will be with editable Bézier splines.
![Bézier](DNA_devlog_1_bézier.png)

In this update I made a quick and simple implementation of an editable Bézier curve with four movable points. Here is a demonstration.
![Demonstration](DNA_devlog_1_recording_6-17-25.mp4)

From here I'll add more general spline editing and probably focus on the actual data encoding functionality LAST.

Thanks for reading!
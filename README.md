# LEDE PROJECT 2 ANALYSIS
### Westminster's Top Dogs
Completed project can be found [here]("https://nguyenkim.ca/data-viz/westminster")

## 1. Project Motivations
I am addicted to watching Westminster Dog Show videos uploaded on YouTube, and the idea for this project came to me a year ago when I came across the Best in Show data set on the WKC website. I then paid a visit to the AKC library and Museum of the Dog for further research, sourcing, and access to archival content to build out the story.

## 2. Findings 

### 2.1 Preliminary design choices


### 2.2 Data shape
The dataset was arranged into a rectangular shape (each column represented a variable, each row an instance based on year). Therefore I felt that a categorical heatmap was used to visualize the 700 points.


## 3. Methodology
#### Design stack:
- Figma
- Adobe Photoshop

#### Tools used:
- Scraping + Processing + Viz: 
	- requests + lxml
	- Jupyter Lab + Pandas
	- RAWgraphs (prototyping) + D3

### 3.1 Collection
- Data was scraped from Best in Show and Best of Group records available on the [Westminster Kennel Club's website]("https://westminsterkennelclub.org/")
- Categorical + print record data was obtained from the AKC library and archives.

### 3.2 Analysis
- Analysis and cleaning performed in python (pandas + numpy).
- Output to CSV, fed into JS + D3.

## 4. Reflections
Scraping the two datasets, combining, and rearranging the data (with `.transpose` and `.groupby`) was relatively straightforward due to the way tables were structured.

In contrast with the Gilmore Girls lit canon project, the bulk of time spent on this story was on laying out and visualizing the data, specifically with respect to annotations. 

## 5. Next Steps
Addressing the issues + nice to haves in 5.1 and 5.2

### 5.1 Issues
- heatmap axis display
- heatmap legend display
- scrollama step 1 - update image to change with corresponding stem

### 5.2 Nice to haves
- implement a running tally of BIS winners that update as the user scrolls down the page.
- implement a table of breeds per each group.

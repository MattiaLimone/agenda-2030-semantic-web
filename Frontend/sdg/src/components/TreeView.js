import React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

export default function FileSystemNavigator(props) {
  let result = new Array();
  const list = new Array();
  let data = props.data;
  let prev = data[0];
  let tmp = prev.target;
  let tmp2 = prev.indicator;
  prev.target = new Array();
  prev.target.push(tmp);

  for (let i = 1; i < data.length; i++) {
    if (prev.goal_label == data[i].goal_label) {
      prev.target.push(data[i].target);
    } else {
      result.push(prev);
      prev = data[i];
      let tmp = prev.target;
      prev.target = new Array();
      prev.target.push(tmp);
    }
  }
  result.push(prev)
  result = result.sort((a, b) => a.index - b.index)
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      
      {result.map((item, index) => {
        item.target = item.target.sort((a, b) => a.target_index - b.target_index)
        let rows = []
        if (typeof list[index] == 'undefined') {
          list[index] = item.target;
          for (let i = 0; i < list.length; i++) {
            rows.push(<TreeItem nodeId={'target' + Math.random()} label={list[i].target_label}></TreeItem>);
          }
        }
        return (
          <TreeItem key={Math.random()} nodeId={'goal' + Math.random()}label={item.goal_label}>
            {rows}
          </TreeItem>
        )
      })}
    </TreeView>
  );
}
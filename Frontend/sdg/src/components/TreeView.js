import React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

function parseObjectProperties(obj, parse) {
  for (var k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      parseObjectProperties(obj[k], parse)
    } else if (obj.hasOwnProperty(k)) {
      parse(k, obj[k])
    }
  }
}
export default function FileSystemNavigator(props) {

  var keys = [['goal_label'], ['target_label']]
  var tree = props.data.reduce((r, o) => {
    var target = keys.reduce((q, [k, t]) => {
      var key = [t, o[k]].join('');
      return q[key] = q[key] || {};
    }, r);
    (target.children = target.children || []).push(o);
    return r;
  }, {});
  console.log(typeof(tree))
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId="1" label="Applications">
        
      </TreeItem>

    </TreeView>
  );
}
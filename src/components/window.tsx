import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

export default function TubeJointVisualizer() {
  //   const [tubes, setTubes] = useState([
  //     {
  //       id: 1,
  //       type: 'rectangular',
  //       width: 40,
  //       height: 60,
  //       thickness: 5,
  //       length: 100,
  //       position: { x: -50, y: 0, z: 0 },
  //       rotation: 0,
  //       jointAngle: null
  //     }
  //   ]);

  //   const [selectedTube, setSelectedTube] = useState(1);
  //   const [viewMode, setViewMode] = useState('solid');
  //   const [showJoints, setShowJoints] = useState(true);
  //   const [history, setHistory] = useState([]);
  //   const [historyIndex, setHistoryIndex] = useState(-1);

  //   const currentTube = tubes.find(t => t.id === selectedTube);

  //   const addToHistory = useCallback(() => {
  //     const newHistory = history.slice(0, historyIndex + 1);
  //     newHistory.push(JSON.parse(JSON.stringify(tubes)));
  //     setHistory(newHistory);
  //     setHistoryIndex(newHistory.length - 1);
  //   }, [tubes, history, historyIndex]);

  //   const handleUndo = () => {
  //     if (historyIndex > 0) {
  //       setHistoryIndex(historyIndex - 1);
  //       setTubes(JSON.parse(JSON.stringify(history[historyIndex - 1])));
  //     }
  //   };

  //   const handleRedo = () => {
  //     if (historyIndex < history.length - 1) {
  //       setHistoryIndex(historyIndex + 1);
  //       setTubes(JSON.parse(JSON.stringify(history[historyIndex + 1])));
  //     }
  //   };

  //   const handleAddTube = () => {
  //     const newTube = {
  //       id: Date.now(),
  //       type: 'rectangular',
  //       width: 40,
  //       height: 40,
  //       thickness: 5,
  //       length: 100,
  //       position: { x: 50, y: 0, z: 0 },
  //       rotation: 0,
  //       jointAngle: null
  //     };
  //     addToHistory();
  //     setTubes([...tubes, newTube]);
  //     setSelectedTube(newTube.id);
  //   };

  //   const handleDeleteTube = () => {
  //     if (tubes.length > 1 && selectedTube !== null) {
  //       addToHistory();
  //       const newTubes = tubes.filter(t => t.id !== selectedTube);
  //       setTubes(newTubes);
  //       setSelectedTube(newTubes[0]?.id || null);
  //     }
  //   };

  //   const handleUpdateTube = (field, value) => {
  //     setTubes(tubes.map(t =>
  //       t.id === selectedTube ? { ...t, [field]: value } : t
  //     ));
  //   };

  //   const handleTubeTransform = (tubeId, delta) => {
  //     setTubes(tubes.map(t =>
  //       t.id === tubeId
  //         ? { ...t, position: { ...t.position, x: t.position.x + delta.x, y: t.position.y + delta.y } }
  //         : t
  //     ));
  //   };

  //   const snapToAngle = (angle) => {
  //     if (selectedTube !== null) {
  //       addToHistory();
  //       handleUpdateTube('rotation', angle);
  //       handleUpdateTube('jointAngle', angle);
  //     }
  //   };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex">
      {/* Left Sidebar - Controls */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {/* <Box className="w-6 h-6" /> */}
          Tube Joint Visualizer
        </h1>

        {/* Toolbar */}
        <div className="flex gap-2 mb-6">
          <button
            // onClick={handleAddTube}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex items-center justify-center gap-2"
          >
            {/* <Plus className="w-4 h-4" /> */}
            Add Tube
          </button>
          <button
            // onClick={handleDeleteTube}
            // disabled={tubes.length <= 1}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            {/* <Trash2 className="w-4 h-4" /> */}
          </button>
          <button
            // onClick={handleUndo}
            // disabled={historyIndex <= 0}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            {/* <RotateCcw className="w-4 h-4" /> */}
          </button>
        </div>

        {/* View Controls */}
        <div className="mb-6 p-4 bg-slate-800 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {/* <Camera className="w-4 h-4" /> */}
            View Mode
          </h3>
          <div className="flex gap-2 mb-3">
            <button
            //   onClick={() => setViewMode('solid')}
            //   className={`flex-1 px-3 py-2 rounded ${viewMode === 'solid' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              Solid
            </button>
            <button
            //   onClick={() => setViewMode('wireframe')}
            //   className={`flex-1 px-3 py-2 rounded ${viewMode === 'wireframe' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              Wireframe
            </button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              //   checked={showJoints}
              //   onChange={(e) => setShowJoints(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Show Joint Indicators</span>
          </label>
        </div>

        {/* Tube Properties */}
        {/* {currentTube && (
          <div className="space-y-4">
            <h3 className="font-semibold">Tube Properties</h3>
            
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                // value={currentTube.type}
                // onChange={(e) => handleUpdateTube('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
              >
                <option value="rectangular">Rectangular</option>
                <option value="square">Square</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Width (mm)</label>
              <input
                type="number"
                value={currentTube.width}
                // onChange={(e) => handleUpdateTube('width', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Height (mm)</label>
              <input
                type="number"
                // value={currentTube.height}
                // onChange={(e) => handleUpdateTube('height', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Thickness (mm)</label>
              <input
                type="number"
                value={currentTube.thickness}
                onChange={(e) => handleUpdateTube('thickness', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Length (mm)</label>
              <input
                type="number"
                value={currentTube.length}
                onChange={(e) => handleUpdateTube('length', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Rotation (degrees)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={currentTube.rotation}
                onChange={(e) => handleUpdateTube('rotation', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-slate-400 text-center">{currentTube.rotation}°</div>
            </div>

            <div>
              <label className="block text-sm mb-2">Snap to Angle</label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 30, 45, 90, 135, 180].map(angle => (
                  <button
                    key={angle}
                    onClick={() => snapToAngle(angle)}
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-sm"
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {/* Tube List */}
        <div className="mt-6">
          {/* <h3 className="font-semibold mb-3">Tubes ({tubes.length})</h3> */}
          <div className="space-y-2">
            {/* {tubes.map((tube, index) => (
              <div
                key={tube.id}
                onClick={() => setSelectedTube(tube.id)}
                className={`p-3 rounded cursor-pointer ${
                  selectedTube === tube.id ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="font-medium">Tube {index + 1}</div>
                <div className="text-xs text-slate-400">
                  {tube.width} × {tube.height} × {tube.length}mm
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 p-4">
        <Canvas>
          <OrbitControls />
          <mesh>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight />
            <boxGeometry />
            <meshStandardMaterial color={"#1e1e1e"} />
            <cylinderGeometry args={[2, 2, 5, 4, 4]} />
            <Edges threshold={15} color={"white"} />
          </mesh>
          <mesh position={[5, 0, 0]}>
            <circleGeometry />
            <meshStandardMaterial color={"#ff0000"} />
            <Edges threshold={15} color={"white"} />
          </mesh>
        </Canvas>
      </div>
    </div>
  );
}
